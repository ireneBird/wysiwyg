import eventEmitter from '../event-emitter';
import { KeyboardKey } from './constants';

class HotKeys {
  #eventEmitter = eventEmitter;

  #editorElement: HTMLDivElement;

  #shortKey: string = /Mac/i.test(navigator.platform)
    ? KeyboardKey.META
    : KeyboardKey.CONTROL;

  constructor({ element }: { element: HTMLDivElement }) {
    this.#editorElement = element;

    this.onKeydown = this.onKeydown.bind(this);

    this.#editorElement.addEventListener(`keydown`, this.onKeydown);
  }

  onKeydown(evt: KeyboardEvent) {
    if (evt[this.#shortKey]) {
      if (evt.code === `KeyZ` && !evt.shiftKey) {
        evt.preventDefault();
        this.#eventEmitter.emit(`toolbar.action.undo`);
        return;
      }

      if (
        evt.code === KeyboardKey.Y ||
        (evt.shiftKey && evt.code === KeyboardKey.Z)
      ) {
        evt.preventDefault();
        this.#eventEmitter.emit(`toolbar.action.redo`);
      }
    }
  }
}

export { HotKeys };
