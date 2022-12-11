import { Control as ControlInterface } from '../interface';

class Control implements ControlInterface {
  isActive = false;

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  fire(): void {
    console.log(this.name);
  }

  render(parent: HTMLElement) {
    console.log(this.name);
  }
}
