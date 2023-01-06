import { SelectControlOption } from './types';

export interface Control {
  name: string | undefined;
  fire(event: Event): void;
  render<T extends Node>(parent: HTMLElement): T;
}

export interface ButtonControl extends Control {
  isActive: boolean;
  setActiveStatus(status: boolean);
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
  options: Map<string, Control>;
  open(): void;
  close(): void;
  renderOptions(parent: HTMLElement, options: SelectControlOption[]): void;
  render(parent: HTMLElement): HTMLElement;
  addOption(name: string, control: Control): void;
  isOpen: boolean;
}

export interface ButtonsGroup extends Group {
  controls: Map<string, ButtonControl>;
  renderOptions(parent: HTMLElement): void;
  addControl(name: string, control: ButtonControl): void;
  deactivateCurrentOption(): void;
}

export interface Toolbar {
  controls: Map<string, ButtonControl | ButtonsGroup | Select>;
  addControl(
    name: string,
    control: ButtonControl | ButtonsGroup | Select,
  ): void;
}
