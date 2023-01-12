import { Command } from '../interfaces';
import { history } from '../state/history';
import { trash } from '../state/trash';

class Redo<T> implements Command<T> {
  #history = history;

  #trash = trash;

  execute(): T | unknown {
    const element = this.#trash.pop();
    this.#history.push(element);

    return element;
  }
}

export { Redo };
