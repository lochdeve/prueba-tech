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
    canUndo,
    handleAddItem,
    handleUndo,
    handleOpenModal,
    handleCloseModal,
    handleDeleteSelected,
    handleDeleteItem,
    handleToggleItemSelection,
  } = useTextList();

  const hasSelectedItems = items.some((item) => item.selected);

  return (
    <>
      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.emptyMessage}>
            There are no elements in the list. Click on 'Add' to add the first
            one.
          </div>
        ) : (
          items.map((item) => (
            <TextListItem
              key={item.id}
              id={item.id}
              text={item.value}
              selected={item.selected}
              onToggleSelection={handleToggleItemSelection}
              onDeleteItem={handleDeleteItem}
            />
          ))
        )}
      </div>

      <Toolbar
        onAdd={handleOpenModal}
        onDelete={handleDeleteSelected}
        onUndo={handleUndo}
        hasSelectedItems={hasSelectedItems}
        selectedCount={selectedCount}
        canUndo={canUndo}
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
