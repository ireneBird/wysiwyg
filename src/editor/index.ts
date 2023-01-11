/* eslint-disable class-methods-use-this */
import emitter from '../event-emitter';
import { blocksSelectOptions, fontsSelectOptions } from '../toolbar/constants';

const inlineTags = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  strike: 'strikeThrough',
};
const inlineStyles = new Map(Object.entries(inlineTags));

export default class Editor {
  #field: HTMLDivElement;

  #curentBlockTag = 'p';

  // selection: Selection | null;

  #eventEmitter = emitter;

  range: Range | undefined;

  // using inline tags
  #selectedInlineStyles: string[] = [];

  constructor({ element }) {
    this.#field = element;
    // this.selection = document.getSelection();
    this.changeStyle = this.changeStyle.bind(this);
    this.changeBlockTag = this.changeBlockTag.bind(this);
    this.onClick = this.onClick.bind(this);
    this.addBlockTag = this.addBlockTag.bind(this);

    this.#eventEmitter.on('edit.keypress', this.addBlockTag);
    // add paragraph tag on new line
    this.#field.addEventListener('keypress', event => {
      this.#eventEmitter.emit('edit.keypress', event);
    });

    this.#field.addEventListener(`keyup`, () => {
      this.getCursorPosition();
    });

    this.#field.addEventListener('click', this.onClick);

    // this.#field.addEventListener('selectstart', () => {
    //   document.addEventListener('selectionchange', this.logSelection);
    // });

    // this.#field.addEventListener('mouseleave', () => {
    //   document.removeEventListener('selectionchange', this.logSelection);
    // });

    // eslint-disable-next-line no-restricted-syntax
    for (const style of inlineStyles.values()) {
      this.#eventEmitter.on(`toolbar.inline.${style}`, this.changeStyle);
    }

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
    this.#eventEmitter.emit('toolbar.active', []);

    this.parentTagActive(e.path[0]);

    this.getCursorPosition();
  }

  returnFocus() {
    const selection = document.getSelection();
    if (this.range && selection) {
      selection.removeAllRanges();
      selection.addRange(this.range);
    }
    this.#field.focus();
  }

  // logSelection() {
  //   // TODO: очистить все кнопки от активного статуса?
  //   this.selection = document.getSelection();
  // }

  changeFont(e) {
    console.log('font ', e.currentTarget.dataset.style);

    document.execCommand('fontName', false, e.currentTarget.dataset.style);

    // this.returnFocus();
  }

  changeBlockTag(e) {
    // TODO: найти ближайшего родителя - блок и изменить тег

    this.#curentBlockTag = e.currentTarget.dataset.style;
    this.returnFocus();
  }

  changeStyle(e) {
    const activeTag = e.currentTarget.dataset.style;

    if (activeTag) {
      this.returnFocus();
      document.execCommand(activeTag, false);
    }
  }

  getCursorPosition() {
    const selection = document.getSelection();
    this.range = selection?.getRangeAt(0);
  }

  addBlockTag(e) {
    this.getCursorPosition();

    if (window.getSelection()?.anchorNode?.parentNode?.nodeName === 'LI')
      return;

    document.execCommand('formatBlock', false, this.#curentBlockTag);
  }

  parentTagActive(elem) {
    if (
      elem.classList.contains('playground') &&
      this.#selectedInlineStyles?.length
    ) {
      console.log(this.#selectedInlineStyles);
      this.#eventEmitter.emit('toolbar.active', this.#selectedInlineStyles);
    }

    if (!elem || !elem.classList || elem.classList.contains('playground')) {
      this.#selectedInlineStyles = [];
      return false;
    }

    // active by tag names
    const tagName = elem.tagName.toLowerCase();
    const command = inlineStyles.get(tagName);

    if (command) {
      this.#selectedInlineStyles.push(command);
    }

    // eslint-disable-next-line consistent-return
    return this.parentTagActive(elem.parentElement);
  }
}

function childOfEditor(child: ParentNode) {
  const editor = document.querySelector('#editor');
  if (editor && (editor.contains(child) || editor === child)) return true;

  return false;
}
