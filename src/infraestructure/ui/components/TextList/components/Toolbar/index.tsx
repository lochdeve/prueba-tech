import { IoArrowUndo } from 'react-icons/io5';
import styles from './Toolbar.module.css';

export interface ToolbarProps {
  onAdd: () => void;
  onDelete: () => void;
  onUndo: () => void;
  hasSelectedItems?: boolean;
  selectedCount?: number;
  canUndo?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAdd,
  onDelete,
  onUndo,
  hasSelectedItems = false,
  selectedCount = 0,
  canUndo = false,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '25px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <button
          className={styles.button + ' ' + styles.undo}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label='Undo last action'
        >
          <IoArrowUndo />
        </button>
        <button
          className={styles.button}
          onClick={onDelete}
          disabled={!hasSelectedItems}
        >
          DELETE {selectedCount > 0 && `(${selectedCount})`}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button className={styles.button + ' ' + styles.add} onClick={onAdd}>
          ADD
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
