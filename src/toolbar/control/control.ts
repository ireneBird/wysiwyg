import { EventEmitter2 } from 'eventemitter2';
import { Control as ControlInterface } from '../interface';
import eventEmitter from '../../event-emitter';
import { ControlOptions } from '../types';

const ACTIVE_CLASS = `active`;

class Control implements ControlInterface {
  #eventEmitter: EventEmitter2 = eventEmitter;

  #element: HTMLButtonElement;

  readonly #eventName: string;

  isActive = false;

  name: string;

  constructor(
    name: string,
    { element, toolbarEventName, editorEventName }: ControlOptions,
  ) {
    this.name = name;
    // TODO: Затем записывать в элемент будем то что отрендерили.
    this.#element = element;
    this.#eventName = toolbarEventName;

    this.fire = this.fire.bind(this);

    this.#element.addEventListener(`click`, this.fire);

    this.#eventEmitter.on(editorEventName, (isActive: boolean) => {
      this.isActive = isActive;
      this.#changeElementActiveClass();
    });
  }

  fire(): void {
    this.#eventEmitter.emit(this.#eventName);
    this.isActive = !this.isActive;
    this.#changeElementActiveClass();
  }

  render(parent: HTMLElement) {
    console.log(this.name);
  }

  #changeElementActiveClass() {
    if (this.isActive) {
      this.#element.classList.add(ACTIVE_CLASS);
    } else {
      this.#element.classList.remove(ACTIVE_CLASS);
    }
  }
}

export default Control;
