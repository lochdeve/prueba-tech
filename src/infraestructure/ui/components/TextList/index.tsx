import List from './components/List/List';
import styles from './index.module.css';

const TextList = () => {
  return (
    <div className={styles.listContainer}>
      <span className={styles.title}>This is a technical proof</span>
      <p className={styles.description}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim,
        aspernatur ratione iure facilis recusandae non veniam quasi voluptas.
        Perspiciatis dignissimos incidunt unde autem iste doloribus, tempora
        distinctio fugiat quasi velit.
      </p>
      <List />
    </div>
  );
};

export default TextList;
