import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toolbar from './index';

describe('Toolbar', () => {
  const mockOnAdd = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnUndo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all buttons', () => {
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={false}
      />
    );

    expect(screen.getByText('ADD')).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByLabelText('Undo last action')).toBeInTheDocument();
  });

  it('should disable undo button when canUndo is false', () => {
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={false}
      />
    );

    const undoButton = screen.getByLabelText('Undo last action');
    expect(undoButton).toBeDisabled();
  });

  it('should enable undo button when canUndo is true', () => {
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={true}
      />
    );

    const undoButton = screen.getByLabelText('Undo last action');
    expect(undoButton).not.toBeDisabled();
  });

  it('should disable delete button when hasSelectedItems is false', () => {
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={false}
      />
    );

    const deleteButton = screen.getByText('DELETE');
    expect(deleteButton).toBeDisabled();
  });

  it('should enable delete button when hasSelectedItems is true', () => {
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={true}
        selectedCount={2}
        canUndo={false}
      />
    );

    const deleteButton = screen.getByText('DELETE (2)');
    expect(deleteButton).not.toBeDisabled();
  });

  it('should show selected count when items are selected', () => {
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={true}
        selectedCount={3}
        canUndo={false}
      />
    );

    expect(screen.getByText('DELETE (3)')).toBeInTheDocument();
  });

  it('should call onAdd when ADD button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={false}
      />
    );

    const addButton = screen.getByText('ADD');
    await user.click(addButton);

    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when DELETE button is clicked and enabled', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={true}
        selectedCount={1}
        canUndo={false}
      />
    );

    const deleteButton = screen.getByText('DELETE (1)');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should call onUndo when undo button is clicked and enabled', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={true}
      />
    );

    const undoButton = screen.getByLabelText('Undo last action');
    await user.click(undoButton);

    expect(mockOnUndo).toHaveBeenCalledTimes(1);
  });

  it('should not call onDelete when DELETE button is disabled', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={false}
      />
    );

    const deleteButton = screen.getByText('DELETE');
    expect(deleteButton).toBeDisabled();
    
    // Even if we try to click, it shouldn't call the function
    await user.click(deleteButton);
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should not call onUndo when undo button is disabled', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar
        onAdd={mockOnAdd}
        onDelete={mockOnDelete}
        onUndo={mockOnUndo}
        hasSelectedItems={false}
        selectedCount={0}
        canUndo={false}
      />
    );

    const undoButton = screen.getByLabelText('Undo last action');
    expect(undoButton).toBeDisabled();
    
    // Even if we try to click, it shouldn't call the function
    await user.click(undoButton);
    expect(mockOnUndo).not.toHaveBeenCalled();
  });
});
