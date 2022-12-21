import { EventEmitter2 } from 'eventemitter2';
import { Control as ControlInterface } from '../interface';
import eventEmitter from '../../event-emitter';
import { ControlOptions } from '../types';
import { renderElement } from '../../helpers';

const ACTIVE_CLASS = `active`;

const getControlTemplate = (id: string, iconName: string): string =>
  `<button class="button" id="${id}"><svg class="icon"><use xlink:href="assets/icons/sprite.svg#${iconName}"></use></svg></button>`;

class Control implements ControlInterface {
  #eventEmitter: EventEmitter2 = eventEmitter;

  #element: HTMLButtonElement;

  readonly #editorEventName: string;

  readonly #eventName: string;

  isActive = false;

  name: string;

  constructor(
    name: string,
    { toolbarElement, toolbarEventName, editorEventName }: ControlOptions,
  ) {
    this.name = name;

    this.#eventName = toolbarEventName;
    this.#editorEventName = editorEventName;

    this.#element = this.render<HTMLButtonElement>(toolbarElement);

    this.fire = this.fire.bind(this);

    this.#addEvents();
  }

  #addEvents() {
    this.#element.addEventListener(`click`, this.fire);

    this.#eventEmitter.on(this.#editorEventName, (isActive: boolean) => {
      this.isActive = isActive;
      this.#changeElementActiveClass();
    });
  }

  #changeElementActiveClass() {
    if (this.isActive) {
      this.#element.classList.add(ACTIVE_CLASS);
    } else {
      this.#element.classList.remove(ACTIVE_CLASS);
    }
  }

  fire(): void {
    this.#eventEmitter.emit(this.#eventName);
    this.isActive = !this.isActive;
    this.#changeElementActiveClass();
  }

  render<T extends Node>(parent: HTMLElement): T {
    return renderElement<T>(parent, getControlTemplate(this.name, this.name));
  }
}

export default Control;
