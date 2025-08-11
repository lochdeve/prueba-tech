import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TextList from './List';

// Mock de los componentes hijos
jest.mock('../ListItem', () => {
  return function MockTextListItem({ text }: { text: string }) {
    return <div data-testid='text-list-item'>{text}</div>;
  };
});

jest.mock('../Toolbar', () => {
  return function MockToolbar() {
    return <div data-testid='toolbar'>Toolbar</div>;
  };
});

describe('TextList Component', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<TextList />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should render the correct number of text items', () => {
    render(<TextList />);
    const textItems = screen.getAllByTestId('text-list-item');
    expect(textItems).toHaveLength(5);
  });

  it('should render all expected text items with correct content', () => {
    const expectedTexts = ['ef6sa', 'e75sa', 'efs899a', 'efs90a', 'ef3445sa'];

    render(<TextList />);

    expectedTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('should render the toolbar component', () => {
    render(<TextList />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should have the correct structure with list and toolbar', () => {
    const { container } = render(<TextList />);

    // Verificar que existe un div con la clase de la lista
    const listContainer = container.querySelector('.list');
    expect(listContainer).toBeInTheDocument();

    // Verificar que el toolbar está presente
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should render text items in the correct order', () => {
    const expectedTexts = ['ef6sa', 'e75sa', 'efs899a', 'efs90a', 'ef3445sa'];

    render(<TextList />);
    const textItems = screen.getAllByTestId('text-list-item');

    textItems.forEach((item, index) => {
      expect(item).toHaveTextContent(expectedTexts[index]);
    });
  });

  it('should pass the correct text prop to each TextListItem', () => {
    const expectedTexts = ['ef6sa', 'e75sa', 'efs899a', 'efs90a', 'ef3445sa'];

    render(<TextList />);

    expectedTexts.forEach((text) => {
      const item = screen.getByText(text);
      expect(item).toBeInTheDocument();
    });
  });
});
