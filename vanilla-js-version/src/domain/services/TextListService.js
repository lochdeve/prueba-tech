import { TextItem } from '../models/TextItem.js';

/**
 * Servicio que maneja la lógica de negocio para la lista de texto
 */
export class TextListService {
  /**
   * Añade un nuevo elemento a la lista si el valor no está vacío
   * @param {TextItem[]} list - Lista actual de elementos
   * @param {string} value - Valor del nuevo elemento
   * @returns {TextItem[]} Nueva lista con el elemento añadido
   */
  static addTextItem(list, value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return list;
    }

    const newItem = TextItem.create(trimmed);
    return [...list, newItem];
  }

  /**
   * Elimina un elemento específico de la lista por ID
   * @param {TextItem[]} list - Lista actual de elementos
   * @param {string} itemId - ID del elemento a eliminar
   * @returns {TextItem[]} Nueva lista sin el elemento eliminado
   */
  static removeItem(list, itemId) {
    return list.filter((item) => item.id !== itemId);
  }

  /**
   * Elimina todos los elementos seleccionados de la lista
   * @param {TextItem[]} list - Lista actual de elementos
   * @returns {TextItem[]} Nueva lista sin los elementos seleccionados
   */
  static removeSelectedItems(list) {
    return list.filter((item) => !item.selected);
  }

  /**
   * Alterna la selección de un elemento específico
   * @param {TextItem[]} list - Lista actual de elementos
   * @param {string} itemId - ID del elemento a alternar
   * @returns {TextItem[]} Nueva lista con el elemento alternado
   */
  static toggleItemSelection(list, itemId) {
    return list.map((item) =>
      item.id === itemId ? item.toggleSelection() : item
    );
  }

  /**
   * Selecciona un elemento específico
   * @param {TextItem[]} list - Lista actual de elementos
   * @param {string} itemId - ID del elemento a seleccionar
   * @returns {TextItem[]} Nueva lista con el elemento seleccionado
   */
  static selectItem(list, itemId) {
    return list.map((item) => (item.id === itemId ? item.select() : item));
  }

  /**
   * Deselecciona un elemento específico
   * @param {TextItem[]} list - Lista actual de elementos
   * @param {string} itemId - ID del elemento a deseleccionar
   * @returns {TextItem[]} Nueva lista con el elemento deseleccionado
   */
  static deselectItem(list, itemId) {
    return list.map((item) => (item.id === itemId ? item.deselect() : item));
  }

  /**
   * Deselecciona todos los elementos de la lista
   * @param {TextItem[]} list - Lista actual de elementos
   * @returns {TextItem[]} Nueva lista con todos los elementos deseleccionados
   */
  static deselectAllItems(list) {
    return list.map((item) => item.deselect());
  }

  /**
   * Obtiene el número de elementos seleccionados
   * @param {TextItem[]} list - Lista de elementos
   * @returns {number} Número de elementos seleccionados
   */
  static getSelectedCount(list) {
    return list.filter((item) => item.selected).length;
  }

  /**
   * Verifica si hay elementos seleccionados
   * @param {TextItem[]} list - Lista de elementos
   * @returns {boolean} true si hay elementos seleccionados
   */
  static hasSelectedItems(list) {
    return this.getSelectedCount(list) > 0;
  }

  /**
   * Deshace la última acción de añadir un elemento
   * @param {TextItem[]} list - Lista actual de elementos
   * @returns {TextItem[]} Nueva lista sin el último elemento añadido
   */
  static undoLastAdd(list) {
    if (list.length === 0) {
      return list;
    }

    return list.slice(0, -1);
  }

  /**
   * Valida que el valor no esté vacío
   * @param {string} value - Valor a validar
   * @returns {boolean} true si el valor es válido
   */
  static isValidValue(value) {
    return value && value.trim().length > 0;
  }

  /**
   * Convierte la lista a un array de objetos planos
   * @param {TextItem[]} list - Lista de elementos
   * @returns {Object[]} Array de objetos planos
   */
  static toJSON(list) {
    return list.map((item) => item.toJSON());
  }

  /**
   * Crea una lista desde un array de objetos planos
   * @param {Object[]} data - Array de objetos planos
   * @returns {TextItem[]} Lista de elementos
   */
  static fromJSON(data) {
    return data.map((item) => TextItem.fromJSON(item));
  }
}
