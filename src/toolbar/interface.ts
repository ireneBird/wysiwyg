export interface Control {
  name: string | undefined;
  isActive: boolean;
  fire(event: Event): void;
  setActiveStatus(status: boolean);
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
  controls: Map<string, Control>;
}

export interface Toolbar {
  controls: Map<string, Control | ButtonsGroup | Select>;
  addControl(name: string, control: Control | ButtonsGroup | Select): void;
}
