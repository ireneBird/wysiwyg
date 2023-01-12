// eslint-disable-next-line import/no-cycle
import { Redo, Save, Undo } from './commands';
import emitter from '../event-emitter';
import { debounce } from '../helpers';

class UndoRedo {
  #eventEmitter = emitter;

  #editorElement: HTMLDivElement;

  #undo = new Undo();

  #redo = new Redo();

  #save = new Save();

  constructor({ element }: { element: HTMLDivElement }) {
    this.#editorElement = element;

    this.save(this.#editorElement.innerHTML);

    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);
    this.onKeydown = this.onKeydown.bind(this);

    this.#eventEmitter.on(`toolbar.action.undo`, this.undo);

    this.#eventEmitter.on(`toolbar.action.redo`, this.redo);

    this.#editorElement.addEventListener(`input`, this.onInput);
    this.#editorElement.addEventListener(`keydown`, this.onKeydown);
  }

  onInput = debounce((event: Event) => {
    this.save((event.target as HTMLDivElement).innerHTML);
  }, 300);

  onKeydown(evt: KeyboardEvent) {
    if (evt.ctrlKey) {
      if (evt.code === `KeyZ`) {
        evt.preventDefault();
        this.undo();
        return;
      }

      if (evt.code === `KeyY`) {
        evt.preventDefault();
        this.redo();
      }
    }
  }

  undo() {
    let html = <string>this.#undo.execute();

    if (this.#editorElement.innerHTML === html) {
      html = <string>this.#undo.execute();
    }

    if (html !== undefined) {
      this.#editorElement.innerHTML = html;
    }
  }

  redo() {
    let html = <string>this.#redo.execute();

    if (this.#editorElement.innerHTML === html) {
      html = <string>this.#redo.execute();
    }

    if (html !== undefined) {
      this.#editorElement.innerHTML = html;
    }
  }

  save(element: string) {
    this.#save.execute(element);
  }
}

export { UndoRedo };
