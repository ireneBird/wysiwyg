import Control from './control/control';
import {
  ButtonsGroup,
  Control as ControlInterface,
  Select,
  Toolbar as ToolbarInterface,
} from './interface';

export type ToolbarOptions = {
  element: HTMLElement;
  controls: string[];
};

class Toolbar implements ToolbarInterface {
  readonly #element: HTMLElement;

  controls: Array<ControlInterface | ButtonsGroup | Select> = [];

  constructor({ element, controls }: ToolbarOptions) {
    this.#element = element;

    controls.forEach((name: string): void => {
      const control = new Control(name, {
        toolbarEventName: `toolbar.style.${name}`,
        editorEventName: `editor.style.${name}`,
        toolbarElement: this.#element,
      });

      this.addControl(control);
    });
  }

  addControl(control: ControlInterface): void {
    this.controls.push(control);
  }
}

export default Toolbar;
