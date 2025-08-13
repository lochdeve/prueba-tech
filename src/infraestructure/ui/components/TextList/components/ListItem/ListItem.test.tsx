import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TextListItem from './index';

describe('TextListItem', () => {
  const defaultProps = {
    id: 'test-id',
    text: 'Test Item',
    selected: false,
    onToggleSelection: jest.fn(),
    onDeleteItem: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render with correct text', () => {
    render(<TextListItem {...defaultProps} />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('should apply selected class when selected is true', () => {
    render(<TextListItem {...defaultProps} selected={true} />);

    const item = screen.getByText('Test Item');
    expect(item).toHaveClass('selected');
  });

  it('should not apply selected class when selected is false', () => {
    render(<TextListItem {...defaultProps} selected={false} />);

    const item = screen.getByText('Test Item');
    expect(item).not.toHaveClass('selected');
  });

  it('should handle rapid clicks correctly', async () => {
    render(<TextListItem {...defaultProps} />);

    const item = screen.getByText('Test Item');

    // Rapid clicks
    fireEvent.click(item);
    fireEvent.click(item);
    fireEvent.click(item);

    expect(defaultProps.onDeleteItem).toHaveBeenCalledWith('test-id');
    expect(defaultProps.onToggleSelection).not.toHaveBeenCalled();
  });

  it('should handle different item IDs correctly', () => {
    const customProps = {
      ...defaultProps,
      id: 'custom-id',
      text: 'Custom Item',
    };

    render(<TextListItem {...customProps} />);

    const item = screen.getByText('Custom Item');
    fireEvent.click(item);

    waitFor(() => {
      jest.advanceTimersByTime(200);
    });

    expect(defaultProps.onToggleSelection).toHaveBeenCalledWith('custom-id');
  });
});
