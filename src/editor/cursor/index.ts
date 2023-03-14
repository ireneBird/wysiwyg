export default class Cursor {
  #range: Range | undefined = undefined;

  get getRange() {
    return this.#range;
  }

  setCurrentRangeToSelection() {
    const selection = document.getSelection();

    if (selection && this.#range) {
      selection.removeAllRanges();
      selection.addRange(this.#range);
    }
  }

  setRange(newRange: Range) {
    this.#range = newRange;
  }

  getCursorPosition() {
    const selection = document.getSelection();
    if (selection) {
      this.#range = selection.getRangeAt(0);
    }
  }

  hasRange() {
    return !!this.#range;
  }

  getCurrentRange() {}
}
