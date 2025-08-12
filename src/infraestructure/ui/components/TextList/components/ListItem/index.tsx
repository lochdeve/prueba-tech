import React, { useRef } from 'react';
import styles from './ListItem.module.css';

export interface TextListItemProps {
  id: string;
  text: string;
  selected: boolean;
  onToggleSelection: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const TextListItem: React.FC<TextListItemProps> = ({
  id,
  text,
  selected,
  onToggleSelection,
  onDeleteItem,
}) => {
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      onDeleteItem(id);
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      onToggleSelection(id);
      clickTimeoutRef.current = null;
    }, 200);
  };

  return (
    <div
      className={`${styles.textListItem} ${selected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      {text}
    </div>
  );
};

export default TextListItem;
