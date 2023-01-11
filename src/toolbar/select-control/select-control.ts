import { Control as ControlInterface } from '../interface';
import eventEmitter from '../../event-emitter';
import { SelectControlOptions } from '../types';
import { renderElement } from '../../helpers';

type SelectOptionTemplate = {
  value: string;
  inline?: {
    key: string;
    value: string;
  };
  tagName?: string;
};

const getSelectOptionTemplate = ({
  value,
  inline,
  tagName,
}: SelectOptionTemplate): string =>
  `<li class="menu__item">
      <button class="dropdown__btn-style" ${
        inline ? `style="${inline.key}: ${inline.value}"` : ``
      } data-style="${tagName || inline?.value}">
      ${tagName ? `<${tagName}>${value}</${tagName}>` : value}
    </button>
</li>`;

class SelectControl implements ControlInterface {
  #eventEmitter = eventEmitter;

  #element: HTMLButtonElement;

  readonly #inlineStyle?: {
    key: string;
    value: string;
  };

  readonly #tagName?: string;

  readonly #eventName: string;

  readonly #selectEmitEventName: string;

  name: string;

  constructor(
    name: string,
    {
      selectElement,
      emitEventName,
      selectEmitEventName,
      inlineStyle,
      tagName,
    }: SelectControlOptions,
  ) {
    this.name = name;

    this.#eventName = emitEventName;

    this.#selectEmitEventName = selectEmitEventName;

    this.#inlineStyle = inlineStyle;

    this.#tagName = tagName;

    this.#element =
      this.render<HTMLButtonElement>(selectElement).querySelector(
        `.dropdown__btn-style`,
      )!;

    this.fire = this.fire.bind(this);

    this.#addEvents();
  }

  fire(event): void {
    this.#eventEmitter.emit(this.#eventName, event);
    this.#eventEmitter.emit(this.#selectEmitEventName, {
      value: this.name,
      title: this.name,
    });
  }

  render<T extends Node>(parent: HTMLElement): T {
    return renderElement<T>(
      parent,
      getSelectOptionTemplate({
        value: this.name,
        inline: this.#inlineStyle,
        tagName: this.#tagName,
      }),
    );
  }

  #addEvents() {
    this.#element.addEventListener(`click`, this.fire);
  }
}

export default SelectControl;
