import { useCallback, useState } from 'react';
import {
  addTextItem,
  undoLastAdd,
} from '../../../../../domain/services/TextListService';
import type { TextList } from '../../../../../domain/types';

export const useTextList = () => {
  const [items, setItems] = useState<TextList>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<TextList[]>([]);

  const handleAddItem = useCallback(async (value: string) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setItems((prevItems) => {
        const newItems = addTextItem(prevItems, value);

        setHistory((prevHistory) => [...prevHistory, prevItems]);
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
    if (history.length === 0) return;

    setItems((prevItems) => {
      const newItems = undoLastAdd(prevItems);

      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory.pop();
        return newHistory;
      });
      return newItems;
    });
  }, [history]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    setItems((prevItems) => prevItems.filter((item) => !item.selected));
  }, []);

  const handleDeleteItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  }, []);

  const handleToggleItemSelection = useCallback((itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  }, []);

  const selectedCount = items.filter((item) => item.selected).length;
  const canUndo = history.length > 0;

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
