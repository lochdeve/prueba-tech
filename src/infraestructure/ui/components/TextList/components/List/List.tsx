import TextListItem from '../ListItem';
import Toolbar from '../Toolbar';
import styles from './List.module.css';

const TextList = () => {
  return (
    <>
      <div className={styles.list}>
        {['ef6sa', 'e75sa', 'efs899a', 'efs90a', 'ef3445sa'].map((text) => (
          <TextListItem key={text} text={text} />
        ))}
      </div>
      <Toolbar />
    </>
  );
};

export default TextList;
