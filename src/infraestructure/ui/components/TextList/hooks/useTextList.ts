import { useCallback, useState } from 'react';
import {
  addTextItem,
  applyUndoAction,
  createAddUndoAction,
  createDeleteItemUndoAction,
  createDeleteSelectedUndoAction,
} from '../../../../../domain/services/TextListService';
import type { TextList, UndoAction } from '../../../../../domain/types';

export const useTextList = () => {
  const [items, setItems] = useState<TextList>([
    { id: '1', value: 'ef6sa', selected: false },
    { id: '2', value: 'e75sa', selected: false },
    { id: '3', value: 'efs899a', selected: false },
    { id: '4', value: 'efs90a', selected: false },
    { id: '5', value: 'ef3445sa', selected: false },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);

  const handleAddItem = useCallback(async (value: string) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setItems((prevItems) => {
        const newItems = addTextItem(prevItems, value);

        if (newItems.length > prevItems.length) {
          const addedItem = newItems[newItems.length - 1];
          const undoAction = createAddUndoAction(addedItem);
          setUndoStack((prevStack) => [...prevStack, undoAction]);
        }

        return newItems;
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar elemento:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;

    setItems((prevItems) => {
      const lastAction = undoStack[undoStack.length - 1];
      const newItems = applyUndoAction(prevItems, lastAction);

      setUndoStack((prevStack) => prevStack.slice(0, -1));

      return newItems;
    });
  }, [undoStack]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    setItems((prevItems) => {
      const selectedItems = prevItems.filter((item) => item.selected);
      const newItems = prevItems.filter((item) => !item.selected);

      if (selectedItems.length > 0) {
        const undoAction = createDeleteSelectedUndoAction(selectedItems);
        setUndoStack((prevStack) => [...prevStack, undoAction]);
      }

      return newItems;
    });
  }, []);

  const handleDeleteItem = useCallback((itemId: string) => {
    setItems((prevItems) => {
      const itemToDelete = prevItems.find((item) => item.id === itemId);
      const newItems = prevItems.filter((item) => item.id !== itemId);

      if (itemToDelete) {
        const undoAction = createDeleteItemUndoAction(itemToDelete);
        setUndoStack((prevStack) => [...prevStack, undoAction]);
      }

      return newItems;
    });
  }, []);

  const handleToggleItemSelection = useCallback((itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const selectedCount = items.filter((item) => item.selected).length;
  const canUndo = undoStack.length > 0;

  return {
    items,
    isModalOpen,
    isLoading,
    selectedCount,
    canUndo,
    handleAddItem,
    handleUndo,
    handleOpenModal,
    handleCloseModal,
    handleDeleteSelected,
    handleDeleteItem,
    handleToggleItemSelection,
  };
};
