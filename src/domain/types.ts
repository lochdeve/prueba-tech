export type TextItem = {
  id: string;
  value: string;
  selected: boolean;
};

export type TextList = TextItem[];

export type UndoAction =
  | { type: 'ADD'; item: TextItem }
  | { type: 'DELETE_SELECTED'; deletedItems: TextItem[] }
  | { type: 'DELETE_ITEM'; deletedItem: TextItem };
