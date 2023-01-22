import eventEmitter from '../event-emitter';

class HotKeys {
  #eventEmitter = eventEmitter;

  #editorElement: HTMLDivElement;

  #shortKey: string = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

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

      if (evt.code === `KeyY` || (evt.shiftKey && evt.code === `KeyZ`)) {
        evt.preventDefault();
        this.#eventEmitter.emit(`toolbar.action.redo`);
      }
    }
  }
}

export { HotKeys };
