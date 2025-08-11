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
    handleAddItem,
    handleOpenModal,
    handleCloseModal,
    handleReload,
    handleDeleteSelected,
  } = useTextList();

  const hasSelectedItems = items.some((item) => item.selected);

  return (
    <>
      <div className={styles.list}>
        {items.map((item) => (
          <TextListItem key={item.id} text={item.value} />
        ))}
      </div>

      <Toolbar
        onAdd={handleOpenModal}
        onReload={handleReload}
        onDelete={handleDeleteSelected}
        hasSelectedItems={hasSelectedItems}
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
