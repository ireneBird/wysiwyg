import { Command } from '../interfaces';
import { trash } from '../state/trash';
import { history } from '../state/history';

class Undo<T> implements Command<T> {
  #history = history;

  #trash = trash;

  execute(): T | unknown {
    const element = this.#history.pop();
    this.#trash.push(element);

    return element;
  }
}

export { Undo };
