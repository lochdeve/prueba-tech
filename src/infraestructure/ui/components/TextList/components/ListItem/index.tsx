import React from 'react';
import styles from './ListItem.module.css';

export interface TextListItemProps {
  id: string;
  text: string;
  selected: boolean;
  onToggleSelection: (id: string) => void;
}

const TextListItem: React.FC<TextListItemProps> = ({
  id,
  text,
  selected,
  onToggleSelection,
}) => {
  const handleClick = () => {
    onToggleSelection(id);
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
