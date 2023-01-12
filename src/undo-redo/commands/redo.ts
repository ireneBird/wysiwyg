import { Command } from '../interfaces';
import { history, trash } from '../state';

class Redo<T> implements Command<T> {
  #history = history;

  #trash = trash;

  execute(): T | unknown {
    const element = this.#trash.pop();

    if (element) {
      this.#history.push(element);
    }

    return element;
  }
}

export { Redo };
