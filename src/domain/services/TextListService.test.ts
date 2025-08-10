import type { TextList } from '../types';
import { addTextItem } from './TextListService';

describe('addTextItem', () => {
  const mockTextList: TextList = [
    {
      id: '1',
      value: 'Item existente',
      selected: false,
    },
  ];

  it('debería añadir un nuevo ítem a la lista cuando el valor no está vacío', () => {
    // Arrange
    const newValue = 'Nuevo ítem';
    const expectedLength = mockTextList.length + 1;

    // Act
    const result = addTextItem(mockTextList, newValue);

    // Assert
    expect(result).toHaveLength(expectedLength);
    expect(result[result.length - 1]).toMatchObject({
      value: newValue,
      selected: false,
    });
    expect(result[result.length - 1].id).toBeDefined();
    expect(typeof result[result.length - 1].id).toBe('string');
  });

  it('debería retornar la lista original cuando el valor está vacío', () => {
    // Arrange
    const emptyValue = '';

    // Act
    const result = addTextItem(mockTextList, emptyValue);

    // Assert
    expect(result).toEqual(mockTextList);
    expect(result).toHaveLength(mockTextList.length);
  });

  it('debería retornar la lista original cuando el valor solo contiene espacios en blanco', () => {
    // Arrange
    const whitespaceValue = '   \t\n  ';

    // Act
    const result = addTextItem(mockTextList, whitespaceValue);

    // Assert
    expect(result).toEqual(mockTextList);
    expect(result).toHaveLength(mockTextList.length);
  });

  it('debería recortar espacios en blanco del valor antes de añadirlo', () => {
    // Arrange
    const valueWithSpaces = '  Valor con espacios  ';
    const expectedTrimmedValue = 'Valor con espacios';

    // Act
    const result = addTextItem(mockTextList, valueWithSpaces);

    // Assert
    expect(result[result.length - 1].value).toBe(expectedTrimmedValue);
  });

  it('debería generar un ID único para cada nuevo ítem', () => {
    // Arrange
    const value1 = 'Primer ítem';
    const value2 = 'Segundo ítem';

    // Act
    const result1 = addTextItem(mockTextList, value1);
    const result2 = addTextItem(result1, value2);

    // Assert
    const newItem1 = result1[result1.length - 1];
    const newItem2 = result2[result2.length - 1];

    expect(newItem1.id).not.toBe(newItem2.id);
    expect(newItem1.id).not.toBe(mockTextList[0].id);
  });

  it('debería mantener los ítems existentes sin modificar', () => {
    // Arrange
    const newValue = 'Nuevo ítem';

    // Act
    const result = addTextItem(mockTextList, newValue);

    // Assert
    expect(result[0]).toEqual(mockTextList[0]);
    expect(result.slice(0, -1)).toEqual(mockTextList);
  });

  it('debería manejar una lista vacía correctamente', () => {
    // Arrange
    const emptyList: TextList = [];
    const newValue = 'Primer ítem';

    // Act
    const result = addTextItem(emptyList, newValue);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      value: newValue,
      selected: false,
    });
    expect(result[0].id).toBeDefined();
  });

  it('debería retornar una nueva lista sin mutar la original', () => {
    // Arrange
    const newValue = 'Nuevo ítem';
    const originalList = [...mockTextList];

    // Act
    const result = addTextItem(mockTextList, newValue);

    // Assert
    expect(result).not.toBe(mockTextList);
    expect(mockTextList).toEqual(originalList);
  });
});
