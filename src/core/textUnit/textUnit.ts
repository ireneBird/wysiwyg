export class TextUnit {
  #textField: HTMLElement;

  constructor(field) {
    this.#textField = field;
  }

  // format() {}

  clearAll() {
    this.#textField.innerHTML = '';
  }

  changeAlign(e) {
    const newAlign = e.currentTarget.dataset.style;

    // this.returnFocus();
    if (newAlign) {
      document.execCommand(newAlign, false);
    }
  }

  countingWords(): number {
    const text = this.#textField.textContent || '';
    const count = text.trim().replace(/\s+/g, ' ').split(' ').length;
    return count;
  }
}
