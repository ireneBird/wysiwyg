import { SelectControlOption } from './types';

export const blocksSelectOptions: SelectControlOption[] = [
  {
    name: `Paragraph`,
    tagName: `p`,
  },
  {
    name: `Heading 1`,
    tagName: `h1`,
  },
  {
    name: `Heading 2`,
    tagName: `h2`,
  },
];

export const fontsSelectOptions: SelectControlOption[] = [
  {
    name: `Helvetica`,
    inlineStyle: {
      key: `font-family`,
      value: `Helvetica`,
    },
  },
  {
    name: `Arial`,
    inlineStyle: {
      key: `font-family`,
      value: `Arial`,
    },
  },
  {
    name: `Verdana`,
    inlineStyle: {
      key: `font-family`,
      value: `Verdana`,
    },
  },
  {
    inlineStyle: {
      key: `font-family`,
      value: `Times New Roman`,
    },
    name: `Times New Roman`,
  },
  {
    name: `Tahoma`,
    inlineStyle: {
      key: `font-family`,
      value: `Tahoma`,
    },
  },
  {
    name: `Terminal`,
    inlineStyle: {
      key: `font-family`,
      value: `Terminal`,
    },
  },
  {
    name: `Impact`,
    inlineStyle: {
      key: `font-family`,
      value: `Impact`,
    },
  },
];
