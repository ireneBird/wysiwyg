/* eslint-disable class-methods-use-this */
import emitter from '../event-emitter';

const inlineTags = {
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
      this.#eventEmitter.on(`toolbar.style.${style}`, this.changeStyle);
    }
  }

  onClick(e) {
    // eslint-disable-next-line no-restricted-syntax
    for (const style of inlineStyles.values())
      this.#eventEmitter.emit(`editor.style.${style}`, false);

    this.parentTagActive(e.path[0]);
  }

  logSelection() {
    // TODO: очистить все кнопки от активного статуса?
    this.selection = document.getSelection();
  }

  changeStyle(e) {
    const activeTag = e.target.parentNode.getAttribute('id');

    if (
      this.selection &&
      this.selection.anchorOffset !== this.selection.focusOffset &&
      activeTag
    ) {
      document.execCommand(activeTag);
    }
  }

  addParagraphTag() {
    if (window.getSelection()?.anchorNode?.parentNode?.nodeName === 'LI')
      return;
    document.execCommand('formatBlock', false, 'p');
  }

  parentTagActive(elem) {
    if (!elem || !elem.classList || elem.classList.contains('playground')) {
      return false;
    }

    // active by tag names
    const tagName = elem.tagName.toLowerCase();

    if (inlineStyles.has(tagName)) {
      this.#eventEmitter.emit(
        `editor.style.${inlineStyles.get(tagName)}`,
        true,
      );
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
