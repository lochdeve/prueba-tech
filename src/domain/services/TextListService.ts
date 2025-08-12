import { v4 as uuid } from 'uuid';
import type { TextList } from '../types';

/**
 * Añade un nuevo ítem a la lista si el valor no está vacío.
 */
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

/**
 * Deshace la última acción de añadir un elemento.
 * Retorna la lista sin el último elemento añadido.
 */
export function undoLastAdd(list: TextList): TextList {
  if (list.length === 0) return list;
  
  return list.slice(0, -1);
}
