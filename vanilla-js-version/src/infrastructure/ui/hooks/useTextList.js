import { TextListService } from '../../../domain/services/TextListService.js';

/**
 * Controlador principal que maneja toda la lógica de la aplicación de lista de texto
 * Patrón Module/Controller para Vanilla JS
 */
export function TextListController() {
  // Estado de la aplicación
  let state = {
    items: [],
    isModalOpen: false,
    isLoading: false,
    history: [],
  };

  // Referencias a elementos del DOM
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

  // Callbacks para actualizar la UI
  const callbacks = {
    onStateChange: null,
    onRender: null,
  };

  /**
   * Inicializa el controlador y obtiene las referencias del DOM
   */
  function initialize() {
    // Obtener referencias a elementos del DOM
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

    // Configurar event listeners
    setupEventListeners();

    // Renderizar estado inicial
    render();
  }

  /**
   * Configura todos los event listeners
   */
  function setupEventListeners() {
    // Botón Add
    elements.addBtn.addEventListener('click', handleOpenModal);

    // Botón Undo
    elements.undoBtn.addEventListener('click', handleUndo);

    // Botón Delete
    elements.deleteBtn.addEventListener('click', handleDeleteSelected);

    // Modal
    elements.closeModalBtn.addEventListener('click', handleCloseModal);
    elements.cancelBtn.addEventListener('click', handleCloseModal);

    // Formulario
    elements.addForm.addEventListener('submit', handleAddItem);

    // Input
    elements.textInput.addEventListener('input', handleInputChange);

    // Cerrar modal al hacer clic fuera
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) {
        handleCloseModal();
      }
    });

    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isModalOpen) {
        handleCloseModal();
      }
    });
  }

  /**
   * Maneja la apertura del modal
   */
  function handleOpenModal() {
    setState({
      ...state,
      isModalOpen: true,
    });

    // Enfocar el input después de que el modal se abra
    setTimeout(() => {
      elements.textInput.focus();
    }, 100);
  }

  /**
   * Maneja el cierre del modal
   */
  function handleCloseModal() {
    setState({
      ...state,
      isModalOpen: false,
    });

    // Limpiar formulario
    elements.addForm.reset();
    hideError();
  }

  /**
   * Maneja el envío del formulario para añadir un elemento
   */
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
      // Simular delay de red (como en React)
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newItems = TextListService.addTextItem(state.items, value);

      setState({
        ...state,
        items: newItems,
        history: [...state.history, state.items],
        isModalOpen: false,
        isLoading: false,
      });

      // Limpiar formulario
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

  /**
   * Maneja el cambio en el input
   */
  function handleInputChange() {
    if (elements.errorMessage.classList.contains('hidden')) {
      return;
    }
    hideError();
  }

  /**
   * Maneja la funcionalidad de deshacer
   */
  function handleUndo() {
    if (state.history.length === 0) return;

    const newItems = TextListService.undoLastAdd(state.items);
    const newHistory = [...state.history];
    newHistory.pop();

    setState({
      ...state,
      items: newItems,
      history: newHistory,
    });
  }

  /**
   * Maneja la eliminación de elementos seleccionados
   */
  function handleDeleteSelected() {
    const newItems = TextListService.removeSelectedItems(state.items);

    setState({
      ...state,
      items: newItems,
    });
  }

  /**
   * Maneja la eliminación de un elemento individual (doble clic)
   */
  function handleDeleteItem(itemId) {
    const newItems = TextListService.removeItem(state.items, itemId);

    setState({
      ...state,
      items: newItems,
    });
  }

  /**
   * Maneja la alternancia de selección de un elemento
   */
  function handleToggleItemSelection(itemId) {
    const newItems = TextListService.toggleItemSelection(state.items, itemId);

    setState({
      ...state,
      items: newItems,
    });
  }

  /**
   * Muestra un mensaje de error
   */
  function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.textInput.classList.add('error');
  }

  /**
   * Oculta el mensaje de error
   */
  function hideError() {
    elements.errorMessage.classList.add('hidden');
    elements.textInput.classList.remove('error');
  }

  /**
   * Actualiza el estado y dispara el renderizado
   */
  function setState(newState) {
    state = newState;
    render();

    if (callbacks.onStateChange) {
      callbacks.onStateChange(state);
    }
  }

  /**
   * Renderiza la UI basada en el estado actual
   */
  function render() {
    renderTextList();
    renderToolbar();
    renderModal();
  }

  /**
   * Renderiza la lista de elementos
   */
  function renderTextList() {
    elements.textList.innerHTML = '';

    state.items.forEach((item) => {
      const itemElement = createTextItemElement(item);
      elements.textList.appendChild(itemElement);
    });
  }

  /**
   * Crea un elemento de la lista
   */
  function createTextItemElement(item) {
    const div = document.createElement('div');
    div.className = `text-item ${item.selected ? 'selected' : ''}`;
    div.textContent = item.value;
    div.dataset.id = item.id;

    // Manejar clic simple (selección)
    let clickTimeout = null;

    div.addEventListener('click', () => {
      if (clickTimeout) {
        // Doble clic - eliminar elemento
        clearTimeout(clickTimeout);
        clickTimeout = null;
        handleDeleteItem(item.id);
      } else {
        // Clic simple - alternar selección
        clickTimeout = setTimeout(() => {
          handleToggleItemSelection(item.id);
          clickTimeout = null;
        }, 200);
      }
    });

    return div;
  }

  /**
   * Renderiza la toolbar
   */
  function renderToolbar() {
    const selectedCount = TextListService.getSelectedCount(state.items);
    const hasSelectedItems = TextListService.hasSelectedItems(state.items);
    const canUndo = state.history.length > 0;

    // Actualizar contador de seleccionados
    if (selectedCount > 0) {
      elements.selectedCount.textContent = `(${selectedCount})`;
    } else {
      elements.selectedCount.textContent = '';
    }

    // Actualizar estado de botones
    elements.undoBtn.disabled = !canUndo;
    elements.deleteBtn.disabled = !hasSelectedItems;
  }

  /**
   * Renderiza el modal
   */
  function renderModal() {
    if (state.isModalOpen) {
      elements.modal.classList.remove('hidden');
    } else {
      elements.modal.classList.add('hidden');
    }

    // Actualizar estado de loading en el formulario
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

  /**
   * Configura callbacks externos
   */
  function setCallbacks(callbacksObj) {
    Object.assign(callbacks, callbacksObj);
  }

  /**
   * Obtiene el estado actual
   */
  function getState() {
    return { ...state };
  }

  // Retornar la API pública del controlador
  return {
    initialize,
    setCallbacks,
    getState,
    // Métodos para testing o uso externo
    handleAddItem,
    handleUndo,
    handleDeleteSelected,
    handleDeleteItem,
    handleToggleItemSelection,
  };
}
