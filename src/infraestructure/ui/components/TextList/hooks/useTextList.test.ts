import { act, renderHook } from '@testing-library/react';
import { useTextList } from './useTextList';

describe('useTextList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('initial state', () => {
    it('should initialize with empty items', () => {
      const { result } = renderHook(() => useTextList());

      expect(result.current.items).toEqual([]);
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe('handleAddItem', () => {
    it('should add a new item successfully', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('Test Item');
        jest.advanceTimersByTime(500);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].value).toBe('Test Item');
      expect(result.current.items[0].selected).toBe(false);
      expect(result.current.isModalOpen).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.canUndo).toBe(true);
    });

    it('should not add empty items', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('');
        jest.advanceTimersByTime(500);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.canUndo).toBe(false);
    });

    it('should not add whitespace-only items', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('   ');
        jest.advanceTimersByTime(500);
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.canUndo).toBe(false);
    });

    it('should trim whitespace from items', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('  Test Item  ');
        jest.advanceTimersByTime(500);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].value).toBe('Test Item');
    });
  });

  describe('handleToggleItemSelection', () => {
    it('should toggle item selection', async () => {
      const { result } = renderHook(() => useTextList());

      // Add an item first
      await act(async () => {
        result.current.handleAddItem('Test Item');
        jest.advanceTimersByTime(500);
      });

      const itemId = result.current.items[0].id;

      // Toggle selection
      act(() => {
        result.current.handleToggleItemSelection(itemId);
      });

      expect(result.current.items[0].selected).toBe(true);
      expect(result.current.selectedCount).toBe(1);

      // Toggle again
      act(() => {
        result.current.handleToggleItemSelection(itemId);
      });

      expect(result.current.items[0].selected).toBe(false);
      expect(result.current.selectedCount).toBe(0);
    });

    it('should handle multiple selected items', async () => {
      const { result } = renderHook(() => useTextList());

      // Add multiple items
      await act(async () => {
        result.current.handleAddItem('Item 1');
        result.current.handleAddItem('Item 2');
        result.current.handleAddItem('Item 3');
        jest.advanceTimersByTime(500);
      });

      const [item1, item2] = result.current.items;

      // Select multiple items
      act(() => {
        result.current.handleToggleItemSelection(item1.id);
        result.current.handleToggleItemSelection(item2.id);
      });

      expect(result.current.selectedCount).toBe(2);
      expect(result.current.items[0].selected).toBe(true);
      expect(result.current.items[1].selected).toBe(true);
      expect(result.current.items[2].selected).toBe(false);
    });
  });

  describe('handleDeleteSelected', () => {
    it('should delete selected items', async () => {
      const { result } = renderHook(() => useTextList());

      // Add items and select some
      await act(async () => {
        result.current.handleAddItem('Item 1');
        result.current.handleAddItem('Item 2');
        result.current.handleAddItem('Item 3');
        jest.advanceTimersByTime(500);
      });

      const [item1, item2, item3] = result.current.items;

      act(() => {
        result.current.handleToggleItemSelection(item1.id);
        result.current.handleToggleItemSelection(item3.id);
      });

      // Delete selected items
      act(() => {
        result.current.handleDeleteSelected();
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).toBe(item2.id);
      expect(result.current.selectedCount).toBe(0);
      expect(result.current.canUndo).toBe(true);
    });

    it('should not create undo action when no items are selected', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('Item 1');
        jest.advanceTimersByTime(500);
      });

      const initialUndoStack = result.current.canUndo;

      act(() => {
        result.current.handleDeleteSelected();
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.canUndo).toBe(initialUndoStack);
    });
  });

  describe('handleDeleteItem', () => {
    it('should delete a specific item', async () => {
      const { result } = renderHook(() => useTextList());

      // Add items
      await act(async () => {
        result.current.handleAddItem('Item 1');
        result.current.handleAddItem('Item 2');
        jest.advanceTimersByTime(500);
      });

      const itemToDelete = result.current.items[0];

      act(() => {
        result.current.handleDeleteItem(itemToDelete.id);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].id).not.toBe(itemToDelete.id);
      expect(result.current.canUndo).toBe(true);
    });

    it('should handle deleting non-existent item', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('Item 1');
        jest.advanceTimersByTime(500);
      });

      const initialItems = [...result.current.items];

      act(() => {
        result.current.handleDeleteItem('non-existent-id');
      });

      expect(result.current.items).toEqual(initialItems);
    });
  });

  describe('handleUndo', () => {
    it('should undo add action', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('Test Item');
        jest.advanceTimersByTime(500);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.canUndo).toBe(true);

      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.canUndo).toBe(false);
    });

    it('should undo delete selected action', async () => {
      const { result } = renderHook(() => useTextList());

      // Add items and select some
      await act(async () => {
        result.current.handleAddItem('Item 1');
        result.current.handleAddItem('Item 2');
        jest.advanceTimersByTime(500);
      });

      const [item1] = result.current.items;

      act(() => {
        result.current.handleToggleItemSelection(item1.id);
        result.current.handleDeleteSelected();
      });

      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.items[0].selected).toBe(false);
      expect(result.current.items[1].selected).toBe(false);
    });

    it('should undo delete item action', async () => {
      const { result } = renderHook(() => useTextList());

      await act(async () => {
        result.current.handleAddItem('Item 1');
        result.current.handleAddItem('Item 2');
        jest.advanceTimersByTime(500);
      });

      const itemToDelete = result.current.items[0];

      act(() => {
        result.current.handleDeleteItem(itemToDelete.id);
      });

      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(2);
      expect(
        result.current.items.find((item) => item.id === itemToDelete.id)
          ?.selected
      ).toBe(false);
    });

    it('should not undo when undo stack is empty', () => {
      const { result } = renderHook(() => useTextList());

      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe('multiple operations', () => {
    it('should handle complex undo scenarios', async () => {
      const { result } = renderHook(() => useTextList());

      // Add items
      await act(async () => {
        result.current.handleAddItem('Item 1');
        jest.advanceTimersByTime(500);
      });

      await act(async () => {
        result.current.handleAddItem('Item 2');
        jest.advanceTimersByTime(500);
      });

      await act(async () => {
        result.current.handleAddItem('Item 3');
        jest.advanceTimersByTime(500);
      });

      // Select and delete some
      act(() => {
        result.current.handleToggleItemSelection(result.current.items[0].id);
        result.current.handleDeleteSelected();
      });

      // Delete another item
      act(() => {
        result.current.handleDeleteItem(result.current.items[0].id);
      });

      expect(result.current.items).toHaveLength(1);

      // Undo delete item
      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(2);

      // Undo delete selected
      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(3);

      // Undo add
      act(() => {
        result.current.handleUndo();
      });

      expect(result.current.items).toHaveLength(2);
    });
  });
});
