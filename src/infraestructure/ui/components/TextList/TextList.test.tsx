import { render, screen } from '@testing-library/react';
import TextList from './index';

// Mock the List component
jest.mock('./components/List/List', () => {
  return function MockList() {
    return <div data-testid='mock-list'>Mock List Component</div>;
  };
});

describe('TextList', () => {
  it('should render the title correctly', () => {
    render(<TextList />);

    expect(screen.getByText('This is a technical proof')).toBeInTheDocument();
  });

  it('should render the description correctly', () => {
    render(<TextList />);

    const description = screen.getByText(
      /Lorem ipsum dolor sit amet consectetur adipisicing elit/
    );
    expect(description).toBeInTheDocument();
  });

  it('should render the List component', () => {
    render(<TextList />);

    expect(screen.getByTestId('mock-list')).toBeInTheDocument();
  });

  it('should have the correct CSS classes', () => {
    render(<TextList />);

    const container = screen.getByText(
      'This is a technical proof'
    ).parentElement;
    expect(container).toHaveClass('listContainer');
  });

  it('should render all elements in the correct structure', () => {
    render(<TextList />);

    // Check that all main elements are present
    expect(screen.getByText('This is a technical proof')).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
    expect(screen.getByTestId('mock-list')).toBeInTheDocument();
  });

  it('should render the complete description text', () => {
    render(<TextList />);

    const fullDescription =
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, aspernatur ratione iure facilis recusandae non veniam quasi voluptas. Perspiciatis dignissimos incidunt unde autem iste doloribus, tempora distinctio fugiat quasi velit.';

    expect(screen.getByText(fullDescription)).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    render(<TextList />);

    // Check that the title is in a span element
    const title = screen.getByText('This is a technical proof');
    expect(title.tagName).toBe('SPAN');

    // Check that the description is in a paragraph element
    const description = screen.getByText(/Lorem ipsum dolor sit amet/);
    expect(description.tagName).toBe('P');
  });
});
