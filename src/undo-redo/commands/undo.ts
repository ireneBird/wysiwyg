import { Command } from '../interfaces';
import { history, trash } from '../state';

class Undo<T> implements Command<T> {
  #history = history;

  #trash = trash;

  execute(): T | unknown {
    const element = this.#history.pop();

    if (element) {
      this.#trash.push(element);
    }

    return element;
  }
}

export { Undo };
