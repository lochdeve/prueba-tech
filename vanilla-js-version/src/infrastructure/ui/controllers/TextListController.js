import { TextListService } from '../../../domain/services/TextListService.js';

export function TextListController() {
  let state = {
    items: [],
    isModalOpen: false,
    isLoading: false,
    undoStack: [],
  };

  const elements = {
    textList: null,
    modal: null,
    addForm: null,
    textInput: null,
    errorMessage: null,
    undoBtn: null,
    deleteBtn: null,
    addBtn: null,
    selectedCount: null,
    closeModalBtn: null,
    cancelBtn: null,
  };

  const callbacks = {
    onStateChange: null,
    onRender: null,
  };

  function initialize() {
    elements.textList = document.getElementById('text-list');
    elements.modal = document.getElementById('modal');
    elements.addForm = document.getElementById('add-form');
    elements.textInput = document.getElementById('text-input');
    elements.errorMessage = document.getElementById('error-message');
    elements.undoBtn = document.getElementById('undo-btn');
    elements.deleteBtn = document.getElementById('delete-btn');
    elements.addBtn = document.getElementById('add-btn');
    elements.selectedCount = document.getElementById('selected-count');
    elements.closeModalBtn = document.getElementById('close-modal');
    elements.cancelBtn = document.getElementById('cancel-btn');

    setupEventListeners();
    render();
  }

  function setupEventListeners() {
    elements.addBtn.addEventListener('click', handleOpenModal);
    elements.undoBtn.addEventListener('click', handleUndo);
    elements.deleteBtn.addEventListener('click', handleDeleteSelected);
    elements.closeModalBtn.addEventListener('click', handleCloseModal);
    elements.cancelBtn.addEventListener('click', handleCloseModal);
    elements.addForm.addEventListener('submit', handleAddItem);
    elements.textInput.addEventListener('input', handleInputChange);

    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) {
        handleCloseModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isModalOpen) {
        handleCloseModal();
      }
    });
  }

  function handleOpenModal() {
    setState({
      ...state,
      isModalOpen: true,
    });

    setTimeout(() => {
      elements.textInput.focus();
    }, 100);
  }

  function handleCloseModal() {
    setState({
      ...state,
      isModalOpen: false,
    });

    elements.addForm.reset();
    hideError();
  }

  async function handleAddItem(event) {
    event.preventDefault();

    const value = elements.textInput.value.trim();

    if (!value) {
      showError('The text cannot be empty');
      return;
    }

    setState({
      ...state,
      isLoading: true,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newItems = TextListService.addTextItem(state.items, value);

      if (newItems.length > state.items.length) {
        const addedItem = newItems[newItems.length - 1];
        const undoAction = TextListService.createAddUndoAction(addedItem);

        setState({
          ...state,
          items: newItems,
          undoStack: [...state.undoStack, undoAction],
          isModalOpen: false,
          isLoading: false,
        });
      } else {
        setState({
          ...state,
          isModalOpen: false,
          isLoading: false,
        });
      }

      elements.addForm.reset();
      hideError();
    } catch (error) {
      console.error('Error al agregar elemento:', error);
      setState({
        ...state,
        isLoading: false,
      });
    }
  }

  function handleInputChange() {
    if (elements.errorMessage.classList.contains('hidden')) {
      return;
    }
    hideError();
  }

  function handleUndo() {
    if (state.undoStack.length === 0) return;

    const lastAction = state.undoStack[state.undoStack.length - 1];
    const newItems = TextListService.applyUndoAction(state.items, lastAction);
    const newUndoStack = state.undoStack.slice(0, -1);

    setState({
      ...state,
      items: newItems,
      undoStack: newUndoStack,
    });
  }

  function handleDeleteSelected() {
    const selectedItems = state.items.filter((item) => item.selected);
    const newItems = TextListService.removeSelectedItems(state.items);

    if (selectedItems.length > 0) {
      const undoAction =
        TextListService.createDeleteSelectedUndoAction(selectedItems);

      setState({
        ...state,
        items: newItems,
        undoStack: [...state.undoStack, undoAction],
      });
    } else {
      setState({
        ...state,
        items: newItems,
      });
    }
  }

  function handleDeleteItem(itemId) {
    const itemToDelete = state.items.find((item) => item.id === itemId);
    const newItems = TextListService.removeItem(state.items, itemId);

    if (itemToDelete) {
      const undoAction =
        TextListService.createDeleteItemUndoAction(itemToDelete);

      setState({
        ...state,
        items: newItems,
        undoStack: [...state.undoStack, undoAction],
      });
    } else {
      setState({
        ...state,
        items: newItems,
      });
    }
  }

  function handleToggleItemSelection(itemId) {
    const newItems = TextListService.toggleItemSelection(state.items, itemId);

    setState({
      ...state,
      items: newItems,
    });
  }

  function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.textInput.classList.add('error');
  }

  function hideError() {
    elements.errorMessage.classList.add('hidden');
    elements.textInput.classList.remove('error');
  }

  function setState(newState) {
    state = newState;
    render();

    if (callbacks.onStateChange) {
      callbacks.onStateChange(state);
    }
  }

  function render() {
    renderTextList();
    renderToolbar();
    renderModal();
  }

  function renderTextList() {
    elements.textList.innerHTML = '';

    state.items.forEach((item) => {
      const itemElement = createTextItemElement(item);
      elements.textList.appendChild(itemElement);
    });
  }

  function createTextItemElement(item) {
    const div = document.createElement('div');
    div.className = `text-item ${item.selected ? 'selected' : ''}`;
    div.textContent = item.value;
    div.dataset.id = item.id;

    let clickTimeout = null;

    div.addEventListener('click', () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
        handleDeleteItem(item.id);
      } else {
        clickTimeout = setTimeout(() => {
          handleToggleItemSelection(item.id);
          clickTimeout = null;
        }, 200);
      }
    });

    return div;
  }

  function renderToolbar() {
    const selectedCount = TextListService.getSelectedCount(state.items);
    const hasSelectedItems = TextListService.hasSelectedItems(state.items);
    const canUndo = state.undoStack.length > 0;

    if (selectedCount > 0) {
      elements.selectedCount.textContent = `(${selectedCount})`;
    } else {
      elements.selectedCount.textContent = '';
    }

    elements.undoBtn.disabled = !canUndo;
    elements.deleteBtn.disabled = !hasSelectedItems;
  }

  function renderModal() {
    if (state.isModalOpen) {
      elements.modal.classList.remove('hidden');
    } else {
      elements.modal.classList.add('hidden');
    }

    const submitBtn = elements.addForm.querySelector('.btn-submit');
    if (state.isLoading) {
      submitBtn.textContent = 'Adding...';
      submitBtn.disabled = true;
      elements.textInput.disabled = true;
    } else {
      submitBtn.textContent = 'Add';
      submitBtn.disabled = false;
      elements.textInput.disabled = false;
    }
  }

  function setCallbacks(callbacksObj) {
    Object.assign(callbacks, callbacksObj);
  }

  function getState() {
    return { ...state };
  }

  return {
    initialize,
    setCallbacks,
    getState,
    handleAddItem,
    handleUndo,
    handleDeleteSelected,
    handleDeleteItem,
    handleToggleItemSelection,
  };
}
