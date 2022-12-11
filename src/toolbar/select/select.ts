import { Control, Select as SelectInterface, SelectOption } from '../interface';

class Select implements SelectInterface {
  activeOption: SelectOption | undefined;

  constructor(public name: string, public options: Control[]) {}

  open(): void {
    console.log(this.name);
  }
}
