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
import { blocksSelectOptions, fontsSelectOptions } from './constants';

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
        this.#groupNames.push(name);
        this.addControl(name, blocksSelect);
        return;
      }

      if (name === `fonts`) {
        const blocksSelect: SelectInterface = new Select(
          `fonts`,
          fontsSelectOptions,
          this.#element,
        );
        this.#groupNames.push(name);
        this.addControl(name, blocksSelect);
        return;
      }

      if (name === `align`) {
        const alignButtonsGroup: ButtonsGroupInterface = new ButtonsGroup({
          name: 'align',
          controls: [
            'align-center',
            'align-justify',
            'align-left',
            'align-right',
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
    }
  }

  activateControls(options: string[]) {
    this.#deactivateAllControls();

    options.forEach(name => {
      const buttonsGroupName = this.#getButtonsGroupName(name);

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
}

export default Toolbar;
