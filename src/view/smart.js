import AbstractView from "./abstract";

class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  // Обновление данных
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }


    this._data = Object.assign(
        {},
        this._data,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  // Обновление элемента
  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  // Восстановление обработчиков после обновления элемента
  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}

export default Smart;
