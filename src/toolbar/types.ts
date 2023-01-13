export type ControlOptions = {
  toolbarElement: HTMLElement;
  emitEventName: string;
  groupEmitEventName?: string;
  isActionControl?: boolean;
};

export type SelectControlOptions = {
  selectElement: HTMLElement;
  emitEventName: string;
  selectEmitEventName: string;
  inlineStyle?: {
    key: string;
    value: string;
  };
  tagName?: string;
};

export type SelectControlOption = {
  name: string;
  inlineStyle?: {
    key: string;
    value: string;
  };
  tagName?: string;
};
