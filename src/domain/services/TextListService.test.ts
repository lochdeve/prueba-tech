import type { TextList, UndoAction } from '../types';
import {
  addTextItem,
  applyUndoAction,
  createAddUndoAction,
  createDeleteItemUndoAction,
  createDeleteSelectedUndoAction,
} from './TextListService';

describe('addTextItem', () => {
  const mockTextList: TextList = [
    {
      id: '1',
      value: 'Item existente',
      selected: false,
    },
  ];

  it('debería añadir un nuevo ítem a la lista cuando el valor no está vacío', () => {
    const newValue = 'Nuevo ítem';
    const expectedLength = mockTextList.length + 1;

    const result = addTextItem(mockTextList, newValue);

    expect(result).toHaveLength(expectedLength);
    expect(result[result.length - 1]).toMatchObject({
      value: newValue,
      selected: false,
    });
    expect(result[result.length - 1].id).toBeDefined();
    expect(typeof result[result.length - 1].id).toBe('string');
  });

  it('debería retornar la lista original cuando el valor está vacío', () => {
    const emptyValue = '';

    const result = addTextItem(mockTextList, emptyValue);

    expect(result).toEqual(mockTextList);
    expect(result).toHaveLength(mockTextList.length);
  });

  it('debería retornar la lista original cuando el valor solo contiene espacios en blanco', () => {
    const whitespaceValue = '   \t\n  ';

    const result = addTextItem(mockTextList, whitespaceValue);

    expect(result).toEqual(mockTextList);
    expect(result).toHaveLength(mockTextList.length);
  });

  it('debería recortar espacios en blanco del valor antes de añadirlo', () => {
    const valueWithSpaces = '  Valor con espacios  ';
    const expectedTrimmedValue = 'Valor con espacios';

    const result = addTextItem(mockTextList, valueWithSpaces);

    expect(result[result.length - 1].value).toBe(expectedTrimmedValue);
  });

  it('debería generar un ID único para cada nuevo ítem', () => {
    const value1 = 'Primer ítem';
    const value2 = 'Segundo ítem';

    const result1 = addTextItem(mockTextList, value1);
    const result2 = addTextItem(result1, value2);

    const newItem1 = result1[result1.length - 1];
    const newItem2 = result2[result2.length - 1];

    expect(newItem1.id).not.toBe(newItem2.id);
    expect(newItem1.id).not.toBe(mockTextList[0].id);
  });

  it('debería mantener los ítems existentes sin modificar', () => {
    const newValue = 'Nuevo ítem';

    const result = addTextItem(mockTextList, newValue);

    expect(result[0]).toEqual(mockTextList[0]);
    expect(result.slice(0, -1)).toEqual(mockTextList);
  });

  it('debería manejar una lista vacía correctamente', () => {
    const emptyList: TextList = [];
    const newValue = 'Primer ítem';

    const result = addTextItem(emptyList, newValue);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      value: newValue,
      selected: false,
    });
    expect(result[0].id).toBeDefined();
  });

  it('debería retornar una nueva lista sin mutar la original', () => {
    const newValue = 'Nuevo ítem';
    const originalList = [...mockTextList];

    const result = addTextItem(mockTextList, newValue);

    expect(result).not.toBe(mockTextList);
    expect(mockTextList).toEqual(originalList);
  });
});

describe('applyUndoAction', () => {
  it('debería deshacer una acción ADD removiendo el elemento', () => {
    const list: TextList = [
      { id: '1', value: 'Item 1', selected: false },
      { id: '2', value: 'Item 2', selected: false },
    ];
    const action: UndoAction = {
      type: 'ADD',
      item: { id: '2', value: 'Item 2', selected: false },
    };

    const result = applyUndoAction(list, action);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('debería deshacer una acción DELETE_SELECTED restaurando los elementos', () => {
    const list: TextList = [{ id: '1', value: 'Item 1', selected: false }];
    const action: UndoAction = {
      type: 'DELETE_SELECTED',
      deletedItems: [
        { id: '2', value: 'Item 2', selected: true },
        { id: '3', value: 'Item 3', selected: false },
      ],
    };

    const result = applyUndoAction(list, action);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.id)).toEqual(['1', '2', '3']);
    expect(result.find((item) => item.id === '2')?.selected).toBe(false);
    expect(result.find((item) => item.id === '3')?.selected).toBe(false);
  });

  it('debería deshacer una acción DELETE_ITEM restaurando el elemento', () => {
    const list: TextList = [{ id: '1', value: 'Item 1', selected: false }];
    const action: UndoAction = {
      type: 'DELETE_ITEM',
      deletedItem: { id: '2', value: 'Item 2', selected: true },
    };

    const result = applyUndoAction(list, action);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.id)).toEqual(['1', '2']);
    expect(result.find((item) => item.id === '2')?.selected).toBe(false);
  });

  it('debería retornar la lista original para acciones desconocidas', () => {
    const list: TextList = [{ id: '1', value: 'Item 1', selected: false }];
    const action = { type: 'UNKNOWN' } as unknown as UndoAction;

    const result = applyUndoAction(list, action);

    expect(result).toEqual(list);
  });

  it('debería ordenar correctamente elementos con IDs no numéricos', () => {
    const list: TextList = [{ id: 'item-1', value: 'Item 1', selected: false }];
    const action: UndoAction = {
      type: 'DELETE_SELECTED',
      deletedItems: [
        { id: 'item-3', value: 'Item 3', selected: true },
        { id: 'item-2', value: 'Item 2', selected: true },
      ],
    };

    const result = applyUndoAction(list, action);

    expect(result).toHaveLength(3);
    expect(result.map((item) => item.id)).toEqual([
      'item-1',
      'item-2',
      'item-3',
    ]);
    expect(result.find((item) => item.id === 'item-2')?.selected).toBe(false);
    expect(result.find((item) => item.id === 'item-3')?.selected).toBe(false);
  });

  it('debería restaurar elementos sin seleccionar independientemente de su estado original', () => {
    const list: TextList = [];
    const action: UndoAction = {
      type: 'DELETE_SELECTED',
      deletedItems: [
        { id: '1', value: 'Item 1', selected: true },
        { id: '2', value: 'Item 2', selected: false },
        { id: '3', value: 'Item 3', selected: true },
      ],
    };

    const result = applyUndoAction(list, action);

    expect(result).toHaveLength(3);
    result.forEach((item) => {
      expect(item.selected).toBe(false);
    });
  });
});

describe('createUndoActions', () => {
  it('debería crear una acción ADD correctamente', () => {
    const item = { id: '1', value: 'Test item', selected: false };

    const action = createAddUndoAction(item);

    expect(action).toEqual({
      type: 'ADD',
      item,
    });
  });

  it('debería crear una acción DELETE_SELECTED correctamente', () => {
    const deletedItems = [
      { id: '1', value: 'Item 1', selected: false },
      { id: '2', value: 'Item 2', selected: false },
    ];

    const action = createDeleteSelectedUndoAction(deletedItems);

    expect(action).toEqual({
      type: 'DELETE_SELECTED',
      deletedItems,
    });
  });

  it('debería crear una acción DELETE_ITEM correctamente', () => {
    const deletedItem = { id: '1', value: 'Test item', selected: false };

    const action = createDeleteItemUndoAction(deletedItem);

    expect(action).toEqual({
      type: 'DELETE_ITEM',
      deletedItem,
    });
  });
});
