import { debounce } from '../../helpers';

class CounterWords {
  #count: number;

  output: HTMLElement | null;

  #textField: HTMLDivElement;

  constructor(element: HTMLDivElement) {
    this.output = document.getElementById('dino-words-counter');
    this.#count = 0;
    this.#textField = element;
    this.init();
  }

  init() {
    if (this.output) this.output.innerText = `words: ${this.#count}`;

    document.addEventListener('input', this.onInput);
  }

  setCount(num: number) {
    this.#count = num;

    if (this.output) this.output.innerText = `words: ${this.#count}`;
  }

  get getCount() {
    return this.#count;
  }

  onInput = debounce((event: EventTarget) => {
    const arrWords = this.#textField.textContent
      ?.replace(/[!@#$%^&*]/g, ' ')
      .trim()
      .split(' ');

    this.setCount(arrWords?.length || 0);
  }, 300);
}

export default CounterWords;
