/* eslint-disable class-methods-use-this */
import emitter from '../event-emitter';

const inlineTags = {
  h1: 'h1',
  h2: 'h2',
  p: 'p',
  b: 'bold',
  i: 'italic',
  u: 'underline',
  strike: 'strikeThrough',
};
const inlineStyles = new Map(Object.entries(inlineTags));

export default class Editor {
  #field: HTMLDivElement;

  selection: Selection | null;

  #eventEmitter = emitter;

  // using inline tags
  #selectedInlineStyles: string[] = [];

  constructor({ element }) {
    this.#field = element;
    this.selection = document.getSelection();
    this.changeStyle = this.changeStyle.bind(this);
    this.onClick = this.onClick.bind(this);

    this.#eventEmitter.on('edit.keypress', this.addParagraphTag);
    // add paragraph tag on new line
    this.#field.addEventListener('keypress', event => {
      this.#eventEmitter.emit('edit.keypress', event);
    });

    this.#field.addEventListener('click', this.onClick);

    this.#field.addEventListener('selectstart', () => {
      document.addEventListener('selectionchange', this.logSelection);
    });

    this.#field.addEventListener('mouseleave', () => {
      document.removeEventListener('selectionchange', this.logSelection);
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const style of inlineStyles.values()) {
      this.#eventEmitter.on(`toolbar.inline.${style}`, this.changeStyle);
    }
  }

  onClick(e) {
    // this.#eventEmitter.emit('toolbar.active', []);

    this.parentTagActive(e.path[0]);
  }

  logSelection() {
    // TODO: очистить все кнопки от активного статуса?
    this.selection = document.getSelection();
  }

  changeStyle(e) {
    let formatBlockTag = '';
    const activeTag = e.currentTarget.id;

    if (!activeTag) {
      formatBlockTag = e.currentTarget.value;
    }

    if (activeTag) {
      this.#field.focus();
      document.execCommand(activeTag);
    } else if (formatBlockTag) {
      document.execCommand('formatBlock', false, formatBlockTag);
    }

    if (
      this.selection &&
      this.selection.anchorOffset !== this.selection.focusOffset
    ) {
      if (activeTag) {
        document.execCommand(activeTag);
      } else if (formatBlockTag) {
        document.execCommand('formatBlock', false, formatBlockTag);
      }
    }
  }

  addParagraphTag(e) {
    if (window.getSelection()?.anchorNode?.parentNode?.nodeName === 'LI')
      return;
    document.execCommand('formatBlock', true, 'p');
  }

  parentTagActive(elem) {
    console.log(elem);
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
