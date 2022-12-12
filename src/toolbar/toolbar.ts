import emitter from '../event-emitter';
import {
  ButtonsGroup,
  Control,
  Select,
  Toolbar as ToolbarInterface,
} from './interface';

class Toolbar implements ToolbarInterface {
  #emitter = emitter;

  #element;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(options) {
    // парсим строку или массив options
    // вызываем addControl
  }

  controls: Control[] | ButtonsGroup[] | Select[] = [];

  addControl(): void {
    console.log(this.controls);
  }
}

export default Toolbar;
