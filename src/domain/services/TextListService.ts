import { v4 as uuid } from 'uuid';
import type { TextList } from '../types';

/**
 * Añade un nuevo ítem a la lista si el valor no está vacío.
 */
export function addTextItem(list: TextList, value: string): TextList {
  const trimmed = value.trim();
  if (!trimmed) return list; // no añadir si está vacío

  return [
    ...list,
    {
      id: uuid(),
      value: trimmed,
      selected: false,
    },
  ];
}
