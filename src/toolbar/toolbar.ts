import Control from './control/control';
import {
  ButtonsGroup as ButtonsGroupInterface,
  Control as ControlInterface,
  Select,
  Toolbar as ToolbarInterface,
} from './interface';
import ButtonsGroup from './buttons-group/buttons-group';

export type ToolbarOptions = {
  element: HTMLElement;
  controls: string[];
};

class Toolbar implements ToolbarInterface {
  readonly #element: HTMLElement;

  controls: Array<ControlInterface | ButtonsGroupInterface | Select> = [];

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

        this.addControl(alignButtonsGroup);

        alignButtonsGroup.renderOptions(this.#element);

        return;
      }

      const control = new Control(name, {
        toolbarEventName: `toolbar.style.${name}`,
        editorEventName: `editor.style.${name}`,
        toolbarElement: this.#element,
      });

      this.addControl(control);
    });
  }

  addControl(control: ControlInterface | ButtonsGroupInterface | Select): void {
    this.controls.push(control);
  }
}

export default Toolbar;
