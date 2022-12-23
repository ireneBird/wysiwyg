/* eslint-disable class-methods-use-this */
import EventEmitter2 from 'eventemitter2';
import emitter from '../event-emitter';

export default class Editor {
  #field: HTMLDivElement;

  #eventEmitter: EventEmitter2 = emitter;

  constructor({ element }) {
    this.#field = element;
    this.#eventEmitter.on('edit.keypress', this.addParagraphTag);

    // add paragraph tag on new line
    this.#field.addEventListener('keypress', event => {
      this.#eventEmitter.emit('edit.keypress', event);
    });

    // add active tag event
    document.addEventListener('selectionchange', this.selectionChange);
  }

  addParagraphTag(e: KeyboardEvent) {
    const activeButtons = getActiveButtons();
    activeButtons.forEach(tag => {
      // const str = `<${tag}><${tag}>`;
      // document.execCommand('insertHtml', false, str);
    });

    if (e.key === 'Enter') {
      // don't add a p tag on list item
      if (window.getSelection()?.anchorNode?.parentNode?.nodeName === 'LI')
        return;
      document.execCommand('formatBlock', false, 'p');
    }
  }

  selectionChange() {
    // TODO: очистить все кнопки от активного статуса

    const { anchorNode } = window.getSelection()!;

    if (anchorNode && childOfEditor(anchorNode.parentNode!)) {
      // проверка на выжделение в редакторе
      parentTagActive(anchorNode.parentElement);
    }
  }
}

function childOfEditor(child: ParentNode) {
  const editor = document.querySelector('#editor');
  if (editor && (editor.contains(child) || editor === child)) return true;

  return false;
}

function getActiveButtons() {
  const toolbar = document.querySelector('.toolbar');
  const buttons = toolbar && toolbar.querySelectorAll('.toolbar-btn');
  const activeStyles: string[] = [];
  if (buttons?.length) {
    // eslint-disable-next-line no-restricted-syntax
    for (const btn of buttons) {
      const elementName = btn.getAttribute('data-el');
      if (btn.classList.contains('active') && elementName) {
        activeStyles.push(elementName);
      }
    }
  }

  console.log('activeStyles =', activeStyles);
  return activeStyles;
}

function parentTagActive(elem) {
  if (!elem || !elem.classList || elem.classList.contains('visuell-view')) {
    return false;
  }

  let toolbarButton;
  // active by tag names
  const tagName = elem.tagName.toLowerCase();
  // eslint-disable-next-line prefer-destructuring
  toolbarButton = document.querySelectorAll(
    `.toolbar .button[data-el="${tagName}"]`,
  )[0];
  if (toolbarButton) {
    toolbarButton.classList.add('active');
  }

  // active by text-align
  const { textAlign } = elem.style;
  // eslint-disable-next-line prefer-destructuring
  toolbarButton = document.querySelectorAll(
    `.toolbar .button[data-style="textAlign:${textAlign}"]`,
  )[0];
  if (toolbarButton) {
    toolbarButton.classList.add('active');
  }

  // eslint-disable-next-line consistent-return
  return parentTagActive(elem.parentElement);
}

// export function getTextBlockStyle(editor) {
//   const { selection } = editor;
//   if (selection == null) {
//     return null;
//   }
//   // gives the forward-direction points in case the selection was
//   // was backwards.
//   const [start, end] = Range.edges(selection);

//   // path[0] gives us the index of the top-level block.
//   let startTopLevelBlockIndex = start.path[0];
//   const endTopLevelBlockIndex = end.path[0];

//   let blockType = null;
//   while (startTopLevelBlockIndex <= endTopLevelBlockIndex) {
//     const [node, _] = Editor.node(editor, [startTopLevelBlockIndex]);
//     if (blockType == null) {
//       blockType = node.type;
//     } else if (blockType !== node.type) {
//       return 'multiple';
//     }
//     startTopLevelBlockIndex += 1;
//   }

//   return blockType;
// }
