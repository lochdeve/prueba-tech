/**
 * Clase que representa un elemento de texto en la lista
 */
export class TextItem {
  /**
   * @param {string} id - Identificador único del elemento
   * @param {string} value - Texto del elemento
   * @param {boolean} selected - Estado de selección del elemento
   */
  constructor(id, value, selected = false) {
    this.id = id;
    this.value = value;
    this.selected = selected;
  }

  /**
   * Crea un nuevo TextItem con un ID único
   * @param {string} value - Texto del elemento
   * @returns {TextItem} Nueva instancia de TextItem
   */
  static create(value) {
    const id = this.generateId();
    return new TextItem(id, value.trim());
  }

  /**
   * Genera un ID único para el elemento
   * @returns {string} ID único
   */
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Alterna el estado de selección del elemento
   * @returns {TextItem} Nueva instancia con el estado cambiado
   */
  toggleSelection() {
    return new TextItem(this.id, this.value, !this.selected);
  }

  /**
   * Marca el elemento como seleccionado
   * @returns {TextItem} Nueva instancia seleccionada
   */
  select() {
    return new TextItem(this.id, this.value, true);
  }

  /**
   * Desmarca el elemento como seleccionado
   * @returns {TextItem} Nueva instancia no seleccionada
   */
  deselect() {
    return new TextItem(this.id, this.value, false);
  }

  /**
   * Verifica si el elemento es válido
   * @returns {boolean} true si el elemento es válido
   */
  isValid() {
    return this.value && this.value.trim().length > 0;
  }

  /**
   * Convierte el elemento a un objeto plano
   * @returns {Object} Objeto con las propiedades del elemento
   */
  toJSON() {
    return {
      id: this.id,
      value: this.value,
      selected: this.selected,
    };
  }

  /**
   * Crea un TextItem desde un objeto plano
   * @param {Object} data - Datos del elemento
   * @returns {TextItem} Nueva instancia de TextItem
   */
  static fromJSON(data) {
    return new TextItem(data.id, data.value, data.selected);
  }
}
