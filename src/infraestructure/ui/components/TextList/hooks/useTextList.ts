import { useCallback, useState } from 'react';
import { addTextItem } from '../../../../../domain/services/TextListService';
import type { TextList } from '../../../../../domain/types';

export const useTextList = (initialItems: TextList = []) => {
  const [items, setItems] = useState<TextList>([
    { id: '1', value: 'ef6sa', selected: false },
    { id: '2', value: 'e75sa', selected: false },
    { id: '3', value: 'efs899a', selected: false },
    { id: '4', value: 'efs90a', selected: false },
    { id: '5', value: 'ef3445sa', selected: false },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = useCallback(async (value: string) => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setItems((prevItems) => addTextItem(prevItems, value));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al agregar elemento:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleReload = useCallback(() => {
    console.log('Recargando lista...');
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

  return {
    items,
    isModalOpen,
    isLoading,
    selectedCount,
    handleAddItem,
    handleOpenModal,
    handleCloseModal,
    handleReload,
    handleDeleteSelected,
    handleDeleteItem,
    handleToggleItemSelection,
  };
};
