import { Control, Select as SelectInterface, SelectOption } from '../interface';
import eventEmitter from '../../event-emitter';
import { renderElement } from '../../helpers';
import { SelectControlOption } from '../types';
import SelectControl from '../select-control/select-control';

const getSelectElement = name => {
  return `<div class="dropdown">
    <button class="dropdown__btn" type="button"></button>
    <ul class="dropdown__menu dropdown__menu_hide" id="${name}"></ul>
  </div>`;
};

class Select implements SelectInterface {
  #eventEmitter = eventEmitter;

  readonly #element: HTMLElement;

  readonly #optionList: HTMLUListElement;

  #openButton: HTMLButtonElement;

  readonly #defaultValue: string;

  options: Map<string, Control> = new Map();

  activeOption: SelectOption | undefined;

  isOpen = false;

  constructor(
    public name: string,
    options: SelectControlOption[],
    toolbarElement: HTMLElement,
  ) {
    this.#element = this.render(toolbarElement);

    this.#optionList = this.#element.querySelector(`.dropdown__menu`)!;

    this.#openButton = this.#element.querySelector(`.dropdown__btn`)!;

    this.renderOptions(this.#optionList, options);

    this.#defaultValue = options[0].name;

    this.#changeButtonTextContent(this.#defaultValue);

    this.activationOption = this.activationOption.bind(this);
    this.onOpenButtonClick = this.onOpenButtonClick.bind(this);
    this.onWindowClick = this.onWindowClick.bind(this);

    this.#eventEmitter.on(`select.${this.name}.change`, this.activationOption);

    this.#addEvents();
  }

  activationOption(option: SelectOption) {
    this.close();

    this.activeOption = option;
    this.#changeButtonTextContent(option.title);
  }

  open(): void {
    this.#optionList.classList.remove(`dropdown__menu_hide`);
    this.isOpen = true;
  }

  close(): void {
    this.#optionList.classList.add(`dropdown__menu_hide`);
    this.isOpen = false;
  }

  renderOptions(parent: HTMLElement, options: SelectControlOption[]) {
    options.forEach((option: SelectControlOption) => {
      const control = new SelectControl(option.name, {
        selectElement: this.#optionList,
        emitEventName: `toolbar.inline.${option.name}`,
        selectEmitEventName: `select.${this.name}.change`,
        inlineStyle: option.inlineStyle,
        tagName: option.tagName,
      });

      this.addOption(option.name, control);
    });
  }

  render(parent: HTMLElement): HTMLElement {
    return renderElement(parent, getSelectElement(this.name));
  }

  addOption(name: string, control: Control) {
    this.options.set(name, control);
  }

  showDefaultValue() {
    this.#changeButtonTextContent(this.#defaultValue);
  }

  #changeButtonTextContent(text: string) {
    this.#openButton.textContent = text;
  }

  #addEvents() {
    this.#openButton.addEventListener(`click`, this.onOpenButtonClick);
    window.addEventListener(`click`, this.onWindowClick);
  }

  onOpenButtonClick(evt: Event) {
    evt.preventDefault();

    if (!this.isOpen) {
      this.open();
    } else {
      this.close();
    }
  }

  onWindowClick(evt: Event) {
    if (
      this.isOpen &&
      (evt.target as HTMLElement).closest(`.dropdown`) !== this.#element
    ) {
      this.close();
    }
  }
}

export { Select };
