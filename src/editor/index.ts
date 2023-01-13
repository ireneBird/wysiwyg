/* eslint-disable class-methods-use-this */
import emitter from '../event-emitter';
import { blocksSelectOptions, fontsSelectOptions } from '../toolbar/constants';

const alignOptions = [
  'justifyCenter',
  'justifyFull',
  'justifyLeft',
  'justifyRight',
];

const inlineTags = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  strike: 'strikeThrough',
};
const inlineStyles = new Map(Object.entries(inlineTags));

const headingTags = {
  p: 'Paragraph',
  h1: 'Heading 1',
  h2: 'Heading 2',
};

const headingTagsMap = new Map(Object.entries(headingTags));

export default class Editor {
  #field: HTMLDivElement;

  #curentBlockTag: string;

  #eventEmitter = emitter;

  range: Range | undefined;

  // using inline tags
  #selectedInlineStyles: string[] = [];

  constructor({ element }) {
    this.#field = element;
    this.#curentBlockTag = 'p';
    this.onClick = this.onClick.bind(this);
    this.parentTagActive = this.parentTagActive.bind(this);
    this.addEvents();
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
    // const index = getCaretIndex(e.path[0]);
    this.#eventEmitter.emit('toolbar.active', []);

    this.parentTagActive(e.path[0]);

    this.getCursorPosition();
  }

  getCursorPosition() {
    const selection = document.getSelection();
    if (selection) {
      this.range = selection.getRangeAt(0);
    }
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
    // document.execCommand('fontName', false, font);
    const selection = document.getSelection();

    const newNode = document.createElement('span');
    newNode.innerHTML = '&#xFEFF';
    newNode.style.fontFamily = font;

    if (selection && selection.getRangeAt(0)) {
      const range = selection.getRangeAt(0);
      console.log('range', range);
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

        // const newRange = new Range();
        // newRange.selectNodeContents(newNode); // или selectNode(p), чтобы выделить и тег <p>
        // newRange.setEndAfter(newNode);
        // newRange.setStartBefore(newNode);
        // selection.removeAllRanges();
        // selection.addRange(newRange);

        this.#field.focus();
      } catch (err) {
        alert(err);
      }
    }
  }

  changeBlockTag(e) {
    // TODO: найти ближайшего родителя - блок и изменить тег

    this.#curentBlockTag = e.currentTarget.dataset.style;
    this.returnFocus();

    document.execCommand('formatBlock', false, this.#curentBlockTag);
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

    document.execCommand('formatBlock', false, this.#curentBlockTag);
  }

  parentTagActive(elem) {
    if (
      elem.classList.contains('playground') &&
      this.#selectedInlineStyles?.length
    ) {
      this.#eventEmitter.emit('toolbar.active', this.#selectedInlineStyles);
    }

    if (!elem || !elem.classList || elem.classList.contains('playground')) {
      this.#selectedInlineStyles = [];
      return false;
    }

    // active by tag names
    const tagName = elem.tagName.toLowerCase();
    const command =
      inlineStyles.get(tagName) ||
      headingTagsMap.get(tagName) ||
      elem.style.fontFamily;

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

function getCaretIndex(element) {
  let position = 0;
  const isSupported = typeof window.getSelection !== 'undefined';
  if (isSupported) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      position = preCaretRange.toString().length;
    }
  }
  return position;
}
