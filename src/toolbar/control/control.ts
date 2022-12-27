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

  readonly #eventName: string;

  readonly #groupEventName?: string;

  isActive = false;

  name: string;

  constructor(
    name: string,
    { toolbarElement, emitEventName, groupEmitEventName }: ControlOptions,
  ) {
    this.name = name;

    this.#eventName = emitEventName;
    this.#groupEventName = groupEmitEventName;

    this.#element = this.render<HTMLButtonElement>(toolbarElement);

    this.fire = this.fire.bind(this);

    this.#addEvents();
  }

  setActiveStatus(status: boolean) {
    this.isActive = status;

    this.#changeElementActiveClass();
  }

  fire(): void {
    if (this.#groupEventName) {
      this.#eventEmitter.emit(this.#groupEventName, {
        value: this.name,
        title: this.name,
      });

      return;
    }

    this.#eventEmitter.emit(this.#eventName);
    this.isActive = !this.isActive;
    this.#changeElementActiveClass();
  }

  render<T extends Node>(parent: HTMLElement): T {
    return renderElement<T>(parent, getControlTemplate(this.name, this.name));
  }

  #addEvents() {
    this.#element.addEventListener(`click`, this.fire);
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
