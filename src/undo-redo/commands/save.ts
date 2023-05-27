import { Command } from '../interfaces';
import { history } from '../state';

class Save<T> implements Command<T> {
  #history = history;

  execute(element): T | unknown {
    this.#history.push(element);

    console.log(this.#history);

    return undefined;
  }
}

export { Save };
