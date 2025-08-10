import styles from './Toolbar.module.css';

const Toolbar = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        backgroundColor: '#f7f7f7',
        marginTop: '10px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
        <button
          className={styles.reload + ' ' + styles.button}
          aria-label='Reload'
        >
          {/* Icono de recarga mejorado, estilo clásico circular */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='M12 4V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
            />
          </svg>
        </button>
        <button className={styles.button}>Delete</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button className={styles.button + ' ' + styles.add}>Add</button>
      </div>
    </div>
  );
};

export default Toolbar;
