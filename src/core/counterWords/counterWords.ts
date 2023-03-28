export class CounterWords {
  #count: number;

  constructor(count = 0) {
    this.#count = count;
  }

  init() {
    const element = document.getElementById('dino-words-counter');
    if (element) element.innerText = `words: ${this.#count}`;
    // document.addEventListener();
  }

  setCount(num: number) {
    this.#count = num;
  }

  get getCount() {
    return this.#count;
  }
}
