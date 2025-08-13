import { v4 as uuid } from 'uuid';
import type { TextItem, TextList, UndoAction } from '../types';

export function addTextItem(list: TextList, value: string): TextList {
  const trimmed = value.trim();
  if (!trimmed) return list;

  return [
    ...list,
    {
      id: uuid(),
      value: trimmed,
      selected: false,
    },
  ];
}

function sortById(a: TextItem, b: TextItem): number {
  const aNum = parseInt(a.id);
  const bNum = parseInt(b.id);
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return aNum - bNum;
  }
  return a.id.localeCompare(b.id);
}

export function applyUndoAction(list: TextList, action: UndoAction): TextList {
  switch (action.type) {
    case 'ADD': {
      return list.filter((item) => item.id !== action.item.id);
    }

    case 'DELETE_SELECTED': {
      const restoredItems = action.deletedItems.map((item) => ({
        ...item,
        selected: false,
      }));
      return [...list, ...restoredItems].sort(sortById);
    }

    case 'DELETE_ITEM': {
      const restoredItem = {
        ...action.deletedItem,
        selected: false,
      };
      return [...list, restoredItem].sort(sortById);
    }

    default:
      return list;
  }
}

export function createAddUndoAction(item: TextItem): UndoAction {
  return { type: 'ADD', item };
}

export function createDeleteSelectedUndoAction(
  deletedItems: TextItem[]
): UndoAction {
  return { type: 'DELETE_SELECTED', deletedItems };
}

export function createDeleteItemUndoAction(deletedItem: TextItem): UndoAction {
  return { type: 'DELETE_ITEM', deletedItem };
}
