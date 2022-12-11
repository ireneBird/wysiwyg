export interface Control {
  name: string | undefined;
  isActive: boolean;
  fire(): void;
  render(parent: HTMLElement);
}

export interface SelectOption {
  value: string;
  title: string;
}

export interface Group {
  name: string;
  activeOption: SelectOption | undefined;
}

export interface Select extends Group {
  open(): void;
  options: Control[];
}

export interface ButtonsGroup extends Group {
  buttons: Control[];
}

export interface Toolbar {
  controls: Control[] | ButtonsGroup[] | Select[];
  addControl(): void;
}
