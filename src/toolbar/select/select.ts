import { Control, Select as SelectInterface, SelectOption } from '../interface';
import eventEmitter from '../../event-emitter';
import { renderElement } from '../../helpers';

const getSelectElement = name => {
  return `<div class="dropdown">
    <button class="dropdown__btn" type="button"></button>
    <ul class="dropdown__menu dropdown__menu_hide" id="${name}"></ul>
  </div>`;
};

class Select implements SelectInterface {
  #eventEmitter = eventEmitter;

  #element: HTMLElement;

  #optionList: HTMLUListElement;

  #openButton: HTMLButtonElement;

  options: Map<string, Control> = new Map();

  activeOption: SelectOption | undefined;

  isOpen = false;

  constructor(
    public name: string,
    options: string[],
    toolbarElement: HTMLElement,
  ) {
    this.#element = this.render(toolbarElement);

    this.#optionList = this.#element.querySelector(`.dropdown__menu`)!;

    this.#openButton = this.#element.querySelector(`.dropdown__btn`)!;

    this.activationOption = this.activationOption.bind(this);

    this.#eventEmitter.on(`select.${this.name}.change`, this.activationOption);
  }

  activationOption(option: SelectOption) {
    this.close();

    if (!this.activeOption) {
      this.activeOption = option;
      // return;
    }

    // if (this.activeOption.value !== option.value) {
    //   this.activeOption = option;
    // } else {
    //   this.activeOption = option;
    // }
  }

  open(): void {
    this.#optionList.classList.remove(`dropdown__menu_hide`);
    this.isOpen = true;
  }

  close(): void {
    this.#optionList.classList.add(`dropdown__menu_hide`);
    this.isOpen = false;
  }

  renderOptions(parent: HTMLElement, options) {
    options.forEach((option: string) => {
      console.log(option, this.name);
    });
  }

  render(parent: HTMLElement): HTMLElement {
    return renderElement(parent, getSelectElement(this.name));
  }
}
