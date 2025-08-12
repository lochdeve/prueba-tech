import React from 'react';
import { Modal } from '../../../Modal';
import { useTextList } from '../../hooks/useTextList';
import { AddItemForm } from '../AddItemForm';
import TextListItem from '../ListItem';
import Toolbar from '../Toolbar';
import styles from './List.module.css';

const TextList: React.FC = () => {
  const {
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
  } = useTextList();

  const hasSelectedItems = items.some((item) => item.selected);

  return (
    <>
      <div className={styles.list}>
        {items.map((item) => (
          <TextListItem
            key={item.id}
            id={item.id}
            text={item.value}
            selected={item.selected}
            onToggleSelection={handleToggleItemSelection}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </div>

      <Toolbar
        onAdd={handleOpenModal}
        onReload={handleReload}
        onDelete={handleDeleteSelected}
        hasSelectedItems={hasSelectedItems}
        selectedCount={selectedCount}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title='Add item to list'
      >
        <AddItemForm
          onSubmit={handleAddItem}
          onCancel={handleCloseModal}
          isLoading={isLoading}
        />
      </Modal>
    </>
  );
};

export default TextList;
