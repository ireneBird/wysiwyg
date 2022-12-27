import Control from './control/control';
import {
  ButtonsGroup as ButtonsGroupInterface,
  Control as ControlInterface,
  Select,
  Toolbar as ToolbarInterface,
} from './interface';
import ButtonsGroup from './buttons-group/buttons-group';
import emitter from '../event-emitter';

export type ToolbarOptions = {
  element: HTMLElement;
  controls: string[];
};

class Toolbar implements ToolbarInterface {
  #eventEmitter = emitter;

  readonly #groupNames: string[] = [];

  readonly #element: HTMLElement;

  controls: Map<string, ControlInterface | ButtonsGroupInterface | Select> =
    new Map();

  constructor({ element, controls }: ToolbarOptions) {
    this.#element = element;

    controls.forEach((name: string): void => {
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

  #getButtonsGroupName(name: string): string | undefined {
    return this.#groupNames.find(groupName => name.includes(groupName));
  }

  activateControls(options: string[]) {
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
    control: ControlInterface | ButtonsGroupInterface | Select,
  ): void {
    this.controls.set(name, control);
  }
}

export default Toolbar;
