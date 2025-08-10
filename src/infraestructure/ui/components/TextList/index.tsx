import List from './components/List/List';

const TextList = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        width: '500px',
        height: '350px',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          color: '#000',
          fontSize: '30px',
          fontFamily: 'Inter',
        }}
      >
        This is a technical proof
      </span>
      <p style={{ color: '#000', textAlign: 'center', fontSize: '14px' }}>
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
