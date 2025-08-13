import { TextItem } from '../models/TextItem.js';

export const UndoActionTypes = {
  ADD: 'ADD',
  DELETE_SELECTED: 'DELETE_SELECTED',
  DELETE_ITEM: 'DELETE_ITEM',
};

export class TextListService {
  static addTextItem(list, value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return list;
    }

    const newItem = TextItem.create(trimmed);
    return [...list, newItem];
  }

  static removeItem(list, itemId) {
    return list.filter((item) => item.id !== itemId);
  }

  static removeSelectedItems(list) {
    return list.filter((item) => !item.selected);
  }

  static toggleItemSelection(list, itemId) {
    return list.map((item) =>
      item.id === itemId ? item.toggleSelection() : item
    );
  }

  static selectItem(list, itemId) {
    return list.map((item) => (item.id === itemId ? item.select() : item));
  }

  static deselectItem(list, itemId) {
    return list.map((item) => (item.id === itemId ? item.deselect() : item));
  }

  static deselectAllItems(list) {
    return list.map((item) => item.deselect());
  }

  static getSelectedCount(list) {
    return list.filter((item) => item.selected).length;
  }

  static hasSelectedItems(list) {
    return this.getSelectedCount(list) > 0;
  }

  static sortById(a, b) {
    const aNum = parseInt(a.id);
    const bNum = parseInt(b.id);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.id.localeCompare(b.id);
  }

  static applyUndoAction(list, action) {
    switch (action.type) {
      case UndoActionTypes.ADD: {
        return list.filter((item) => item.id !== action.item.id);
      }

      case UndoActionTypes.DELETE_SELECTED: {
        const restoredItems = action.deletedItems.map((item) => ({
          ...item,
          selected: false,
        }));
        return [...list, ...restoredItems].sort(this.sortById);
      }

      case UndoActionTypes.DELETE_ITEM: {
        const restoredItem = {
          ...action.deletedItem,
          selected: false,
        };
        return [...list, restoredItem].sort(this.sortById);
      }

      default:
        return list;
    }
  }

  static createAddUndoAction(item) {
    return { type: UndoActionTypes.ADD, item };
  }

  static createDeleteSelectedUndoAction(deletedItems) {
    return { type: UndoActionTypes.DELETE_SELECTED, deletedItems };
  }

  static createDeleteItemUndoAction(deletedItem) {
    return { type: UndoActionTypes.DELETE_ITEM, deletedItem };
  }

  static undoLastAdd(list) {
    if (list.length === 0) {
      return list;
    }

    return list.slice(0, -1);
  }

  static isValidValue(value) {
    return value && value.trim().length > 0;
  }

  static toJSON(list) {
    return list.map((item) => item.toJSON());
  }

  static fromJSON(data) {
    return data.map((item) => TextItem.fromJSON(item));
  }
}
