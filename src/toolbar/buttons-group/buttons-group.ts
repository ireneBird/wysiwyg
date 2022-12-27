import {
  ButtonsGroup as ButtonsGroupInterface,
  Control as ControlInterface,
  SelectOption,
} from '../interface';
import Control from '../control/control';
import emitter from '../../event-emitter';

class ButtonsGroup implements ButtonsGroupInterface {
  #emitter = emitter;

  activeOption: SelectOption | undefined;

  controls: Map<string, ControlInterface> = new Map();

  controlsOptions: string[];

  name: string;

  constructor({ name, controls }: { name: string; controls: string[] }) {
    this.name = name;

    this.controlsOptions = controls;

    this.activationOption = this.activationOption.bind(this);

    this.#emitter.on(`group.style.${this.name}`, this.activationOption);
  }

  activationOption(newActiveOption: SelectOption) {
    if (!this.activeOption) {
      this.activeOption = newActiveOption;
      this.controls.get(this.activeOption.value)?.setActiveStatus(true);

      return;
    }

    if (this.activeOption.value !== newActiveOption.value) {
      this.controls.get(this.activeOption.value)?.setActiveStatus(false);
      this.controls.get(newActiveOption.value)?.setActiveStatus(true);
      this.activeOption = newActiveOption;
    } else {
      this.controls.get(this.activeOption.value)?.setActiveStatus(false);
      this.activeOption = newActiveOption;
    }
  }

  renderOptions(parent: HTMLElement) {
    this.controlsOptions.forEach(name => {
      const control = new Control(name, {
        emitEventName: `toolbar.inline.${name}`,
        groupEmitEventName: `group.style.${this.name}`,
        toolbarElement: parent,
      });

      this.addControl(name, control);
    });
  }

  addControl(controlName: string, control: ControlInterface): void {
    this.controls.set(controlName, control);
  }
}

export default ButtonsGroup;
