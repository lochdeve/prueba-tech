import React from 'react';
import { CgClose } from 'react-icons/cg';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Cerrar modal'
          >
            <CgClose />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
