import {
  ButtonsGroup as ButtonsGroupInterface,
  Control as ControlInterface,
  SelectOption,
} from '../interface';
import Control from '../control/control';

class ButtonsGroup implements ButtonsGroupInterface {
  activeOption: SelectOption | undefined;

  controls: ControlInterface[] = [];

  controlsOptions: string[];

  name: string;

  constructor({ name, controls }: { name: string; controls: string[] }) {
    this.name = name;

    this.controlsOptions = controls;
  }

  renderOptions(parent: HTMLElement) {
    this.controlsOptions.forEach(name => {
      const control = new Control(name, {
        toolbarEventName: `toolbar.style.${name}`,
        editorEventName: `editor.style.${name}`,
        toolbarElement: parent,
      });

      this.addControl(control);
    });
  }

  addControl(control: ControlInterface): void {
    this.controls.push(control);
  }
}

export default ButtonsGroup;
