import Control from './control/control';
import {
  ButtonControl,
  ButtonsGroup as ButtonsGroupInterface,
  Select as SelectInterface,
  Toolbar as ToolbarInterface,
} from './interface';
import ButtonsGroup from './buttons-group/buttons-group';
import emitter from '../event-emitter';
import { Select } from './select/select';
import {
  blocksSelectOptions,
  blocksTags,
  fontsNames,
  fontsSelectOptions,
} from './constants';

export type ToolbarOptions = {
  element: HTMLElement;
  controls: string[];
};

class Toolbar implements ToolbarInterface {
  #eventEmitter = emitter;

  readonly #groupNames: string[] = [];

  readonly #element: HTMLElement;

  controls: Map<
    string,
    ButtonControl | ButtonsGroupInterface | SelectInterface
  > = new Map();

  constructor({ element, controls }: ToolbarOptions) {
    this.#element = element;

    controls.forEach((name: string): void => {
      if (name === `blocks`) {
        const blocksSelect: SelectInterface = new Select(
          `blocks`,
          blocksSelectOptions,
          this.#element,
        );
        this.addControl(name, blocksSelect);
        return;
      }

      if (name === `fonts`) {
        const blocksSelect: SelectInterface = new Select(
          `fonts`,
          fontsSelectOptions,
          this.#element,
        );
        this.addControl(name, blocksSelect);
        return;
      }

      if (name === `align`) {
        const alignButtonsGroup: ButtonsGroupInterface = new ButtonsGroup({
          name: 'align',
          controls: [
            'justifyCenter',
            'justifyFull',
            'justifyLeft',
            'justifyRight',
          ],
        });
        this.#groupNames.push(name);
        this.addControl(name, alignButtonsGroup);
        alignButtonsGroup.renderOptions(this.#element);
        return;
      }

      const control = new Control(name, {
        emitEventName: `toolbar.inline.${name}`,
        toolbarElement: this.#element,
      });

      this.addControl(name, control);
    });

    this.activateControls = this.activateControls.bind(this);

    this.#eventEmitter.on(`toolbar.active`, this.activateControls);
  }

  #deactivateAllControls() {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of this.controls) {
      if (value instanceof Control) {
        value.setActiveStatus(false);
      }

      if (value instanceof ButtonsGroup) {
        value.deactivateCurrentOption();
      }

      if (value instanceof Select) {
        value.showDefaultValue();
      }
    }
  }

  activateControls(options: string[]) {
    this.#deactivateAllControls();

    options.forEach(name => {
      const buttonsGroupName = this.#getButtonsGroupName(name);
      const selectName = this.#getSelectName(name);

      if (buttonsGroupName) {
        const buttonsGroup = this.controls.get(buttonsGroupName);

        if (buttonsGroup instanceof ButtonsGroup) {
          buttonsGroup.activationOption({
            value: name,
            title: name,
          });
        }
        return;
      }

      if (selectName) {
        const select = this.controls.get(selectName);

        if (select instanceof Select) {
          select.activationOption({
            value: name,
            title: name,
          });
        }
      }

      const control = this.controls.get(name);

      if (control instanceof Control) {
        control.setActiveStatus(true);
      }
    });
  }

  addControl(
    name: string,
    control: ButtonControl | ButtonsGroupInterface | SelectInterface,
  ): void {
    this.controls.set(name, control);
  }

  #getButtonsGroupName(name: string): string | undefined {
    return this.#groupNames.find(groupName => name.includes(groupName));
  }

  // eslint-disable-next-line class-methods-use-this
  #getSelectName(name: string): string | undefined {
    switch (true) {
      case blocksTags.includes(name):
        return `blocks`;
      case fontsNames.includes(name):
        return `fonts`;
      default:
        return undefined;
    }
  }
}

export default Toolbar;
