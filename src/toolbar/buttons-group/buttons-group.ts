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

  activationOption(activeOption: SelectOption) {
    if (this.activeOption) {
      if (this.activeOption.value !== activeOption.value) {
        this.#emitter.emit(`editor.style.${this.activeOption.value}`, false);
        this.activeOption = activeOption;
        this.#emitter.emit(`editor.style.${this.activeOption.value}`, true);
      } else {
        this.#emitter.emit(`editor.style.${this.activeOption.value}`, false);
        this.activeOption = undefined;
      }
      return;
    }

    if (!this.activeOption) {
      this.activeOption = activeOption;
      this.#emitter.emit(`editor.style.${this.activeOption.value}`, true);
    }
  }

  renderOptions(parent: HTMLElement) {
    this.controlsOptions.forEach(name => {
      const control = new Control(name, {
        toolbarEventName: `toolbar.style.${name}`,
        editorEventName: `editor.style.${name}`,
        groupEventName: `group.style.${this.name}`,
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
