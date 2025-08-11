import { IoReload } from 'react-icons/io5';
import styles from './Toolbar.module.css';

const Toolbar = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#f7f7f7',
        marginTop: '25px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <button
          className={styles.reload + ' ' + styles.button}
          aria-label='Reload'
        >
          <IoReload />
        </button>
        <button className={styles.button}>DELETE</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button className={styles.button + ' ' + styles.add}>ADD</button>
      </div>
    </div>
  );
};

export default Toolbar;
