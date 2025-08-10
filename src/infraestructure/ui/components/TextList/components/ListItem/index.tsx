import styles from './ListItem.module.css';

const TextListItem = ({ text }: { text: string }) => {
  return <div className={styles.textListItem}>{text}</div>;
};

export default TextListItem;
