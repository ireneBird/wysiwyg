export interface Control {
  name: string | undefined;
  isActive: boolean;
  fire(): void;
  render<T extends Node>(parent: HTMLElement): T;
}

export interface SelectOption {
  value: string;
  title: string;
}

export interface Group {
  name: string;
  activeOption: SelectOption | undefined;
  renderOptions(parent: HTMLElement);
}

export interface Select extends Group {
  open(): void;
  options: Control[];
}

export interface ButtonsGroup extends Group {
  controls: Control[];
}

export interface Toolbar {
  controls: Array<Control | ButtonsGroup | Select>;
  addControl(control: Control): void;
}
