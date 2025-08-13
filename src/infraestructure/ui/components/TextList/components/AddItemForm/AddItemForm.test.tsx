import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddItemForm } from './AddItemForm';

describe('AddItemForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByLabelText('Add item to list')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Type the text here...')
    ).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('shows error for empty submission', async () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const input = screen.getByLabelText('Add item to list');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('the text cannot be empty')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid text', async () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const input = screen.getByLabelText('Add item to list');
    fireEvent.change(input, { target: { value: 'test item' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('test item');
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('clears error when typing after error', async () => {
    render(<AddItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const input = screen.getByLabelText('Add item to list');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.change(input, { target: { value: '' } });

    const submitButton = screen.getByText('Add');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('the text cannot be empty')).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => {
      expect(
        screen.queryByText('the text cannot be empty')
      ).not.toBeInTheDocument();
    });
  });

  it('shows loading state correctly', () => {
    render(
      <AddItemForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByText('Adding...')).toBeInTheDocument();
    expect(screen.getByLabelText('Add item to list')).toBeDisabled();
    expect(screen.getByText('Cancel')).toBeDisabled();
  });
});
