/* eslint-disable class-methods-use-this */
import emitter from '../event-emitter';
import { blocksSelectOptions, fontsSelectOptions } from '../toolbar/constants';
import { inlineTags, headingTags, alignOptions } from './helpers';
import { Cursor } from '../core';
import CounterWords from './counterWords';

const inlineStyles = new Map(Object.entries(inlineTags));

const headingTagsMap = new Map(Object.entries(headingTags));

export default class Editor {
  #field: HTMLDivElement;

  #currentBlockTag: string;

  #eventEmitter = emitter;

  #cursor: Cursor;

  // using inline tags
  #selectedInlineStyles: string[] = [];

  counter: CounterWords;

  constructor({ element }: { element: HTMLDivElement }) {
    this.#field = element;
    this.#cursor = new Cursor();
    this.#currentBlockTag = 'p';
    this.onClick = this.onClick.bind(this);
    this.parentTagActive = this.parentTagActive.bind(this);
    this.addEvents();
    this.counter = new CounterWords(element);
  }

  addEvents() {
    this.changeStyle = this.changeStyle.bind(this);
    this.changeBlockTag = this.changeBlockTag.bind(this);
    this.changeAlign = this.changeAlign.bind(this);
    this.changeFont = this.changeFont.bind(this);
    this.addBlockTag = this.addBlockTag.bind(this);

    this.#eventEmitter.on('edit.keypress', this.addBlockTag);
    // add paragraph tag on new line
    this.#field.addEventListener('keypress', event => {
      this.#eventEmitter.emit('edit.keypress', event);
    });

    this.#field.addEventListener(`keyup`, () => {
      // this.getCursorPosition();
      this.#cursor.getCursorPosition();
    });

    this.#field.addEventListener('click', this.onClick);

    // eslint-disable-next-line no-restricted-syntax
    for (const style of inlineStyles.values()) {
      this.#eventEmitter.on(`toolbar.inline.${style}`, this.changeStyle);
    }

    alignOptions.forEach(type =>
      this.#eventEmitter.on(`toolbar.style.${type}`, this.changeAlign),
    );

    blocksSelectOptions.forEach(el =>
      this.#eventEmitter.on(
        `toolbar.blockTag.${el.tagName}`,
        this.changeBlockTag,
      ),
    );

    fontsSelectOptions.forEach(font =>
      this.#eventEmitter.on(
        `toolbar.style.${font.name.replace(/\s/g, ``)}`,
        this.changeFont,
      ),
    );
  }

  onClick(e) {
    // const index = getCaretIndex(e.composedPath()[0]);
    this.#eventEmitter.emit('toolbar.active', []);
    // this.getCursorPosition();
    this.#cursor.getCursorPosition();

    this.parentTagActive(
      this.#cursor.getRange?.commonAncestorContainer.parentElement,
    );
  }

  returnFocus() {
    this.#cursor.setCurrentRangeToSelection();
    this.#field.focus();
  }

  // logSelection() {
  //   // TODO: очистить все кнопки от активного статуса?
  //   this.selection = document.getSelection();
  // }

  clearNodeFromStyle(node: HTMLElement) {
    // eslint-disable-next-line no-restricted-syntax
    for (const child of Array.from(node.children)) {
      if (
        child.tagName === `SPAN` &&
        (child as HTMLSpanElement).style.fontFamily
      ) {
        const clearedHtml = child.innerHTML;
        child.replaceWith(clearedHtml);
      }
    }
  }

  changeAlign(e) {
    const newAlign = e.currentTarget.dataset.style;

    this.returnFocus();
    if (newAlign) {
      document.execCommand(newAlign, false);
    }
  }

  changeFont(e) {
    // TODO: добавить фокус в пустой спан если не было выделено текста
    const font = e.currentTarget.dataset.style;
    const selection = document.getSelection();

    const newNode = document.createElement('span');
    newNode.innerHTML = '&#xFEFF';
    newNode.style.fontFamily = font;

    if (selection && selection.getRangeAt(0)) {
      const range = selection.getRangeAt(0);

      try {
        if (range.collapsed) {
          range.insertNode(newNode);
        } else {
          range.surroundContents(newNode);
        }

        selection.setBaseAndExtent(
          newNode,
          0,
          newNode,
          newNode.childNodes.length,
        );

        if (newNode.children) {
          this.clearNodeFromStyle(newNode);
        }

        this.#field.focus();
      } catch (err) {
        alert(err);
      }
    }
  }

  changeBlockTag(e) {
    this.#currentBlockTag = e.currentTarget.dataset.style;
    this.returnFocus();

    document.execCommand('formatBlock', false, this.#currentBlockTag);
  }

  changeStyle(e) {
    const newTag = e.currentTarget.dataset.style;

    if (newTag) {
      this.returnFocus();
      document.execCommand(newTag, false);
    }
  }

  addBlockTag() {
    if (window.getSelection()?.anchorNode?.parentNode?.nodeName === 'LI')
      return;

    document.execCommand('formatBlock', false, this.#currentBlockTag);
  }

  parentTagActive(element: HTMLElement | null | undefined) {
    if (
      element &&
      element.classList.contains('playground') &&
      this.#selectedInlineStyles?.length
    ) {
      this.#eventEmitter.emit('toolbar.active', this.#selectedInlineStyles);
    }

    if (!element || element.classList.contains('playground')) {
      this.#selectedInlineStyles = [];
      return false;
    }

    // active by tag names
    const tagName = element.tagName.toLowerCase();
    const command =
      inlineStyles.get(tagName) ||
      headingTagsMap.get(tagName) ||
      element.style.fontFamily;

    if (command && !this.#selectedInlineStyles.includes(command)) {
      this.#selectedInlineStyles.push(command);
    }

    // eslint-disable-next-line consistent-return
    return this.parentTagActive(element.parentElement);
  }
}
