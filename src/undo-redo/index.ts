// eslint-disable-next-line import/no-cycle
import { Redo, Save, Undo } from './commands';
import emitter from '../event-emitter';
import { debounce } from '../helpers';
import { SavedData } from './interfaces';
import { Cursor } from '../core';

class UndoRedo {
  #eventEmitter = emitter;

  readonly #editorElement: HTMLDivElement;

  #undo = new Undo();

  #redo = new Redo();

  #save = new Save();

  #cursor = new Cursor();

  constructor({ element }: { element: HTMLDivElement }) {
    this.#editorElement = element;

    this.save({
      element: this.#editorElement.innerHTML,
      optionsForRestorePosition: {
        context: this.#editorElement,
        length: 0,
        selection: window.getSelection()!,
      },
    });

    this.undo = this.undo.bind(this);
    this.redo = this.redo.bind(this);

    this.#eventEmitter.on(`toolbar.action.undo`, this.undo);

    this.#eventEmitter.on(`toolbar.action.redo`, this.redo);

    this.#editorElement.addEventListener(`input`, this.onInput);
  }

  onInput = debounce((event: Event) => {
    const optionsForRestorePosition = this.#cursor.saveCursorPosition(
      event.target as HTMLDivElement,
    );

    this.save({
      element: (event.target as HTMLDivElement).innerHTML,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      optionsForRestorePosition,
    });

    if (optionsForRestorePosition) {
      this.#cursor.restoreCursor(optionsForRestorePosition);
    }
  }, 500);

  undo() {
    let savedData = <SavedData<string>>this.#undo.execute();

    if (!savedData) {
      return;
    }

    if (this.#editorElement.innerHTML === savedData.element) {
      savedData = <SavedData<string>>this.#undo.execute();
    }

    if (savedData.element !== undefined) {
      this.#editorElement.innerHTML = savedData.element;
      if (savedData.optionsForRestorePosition) {
        this.#cursor.restoreCursor(savedData.optionsForRestorePosition);
      }
    }
  }

  redo() {
    let savedData = <SavedData<string>>this.#redo.execute();

    if (!savedData) {
      return;
    }

    if (this.#editorElement.innerHTML === savedData.element) {
      savedData = <SavedData<string>>this.#redo.execute();
    }

    if (savedData.element !== undefined) {
      this.#editorElement.innerHTML = savedData.element;
      if (savedData.optionsForRestorePosition) {
        this.#cursor.restoreCursor(savedData.optionsForRestorePosition);
      }
    }
  }

  save(element: SavedData<string>) {
    this.#save.execute(element);
  }
}

export { UndoRedo };
