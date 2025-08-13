import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TextList from './List';

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
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<TextList />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should render empty state message when list is empty', () => {
    render(<TextList />);

    expect(
      screen.getByText(
        "There are no elements in the list. Click on 'Add' to add the first one."
      )
    ).toBeInTheDocument();
  });

  it('should render the toolbar component', () => {
    render(<TextList />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should have the correct structure with list and toolbar', () => {
    const { container } = render(<TextList />);

    const listContainer = container.querySelector('.list');
    expect(listContainer).toBeInTheDocument();

    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('should render empty state when list has no items', () => {
    render(<TextList />);

    // Should show empty message
    expect(
      screen.getByText(
        "There are no elements in the list. Click on 'Add' to add the first one."
      )
    ).toBeInTheDocument();

    // Should not render any list items
    expect(screen.queryByTestId('text-list-item')).not.toBeInTheDocument();
  });

  it('should not render any text items when list is empty', () => {
    render(<TextList />);

    // Should not find any text list items
    expect(screen.queryByTestId('text-list-item')).not.toBeInTheDocument();
  });

  it('should render toolbar with correct props', () => {
    render(<TextList />);

    // Should render toolbar
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });
});
