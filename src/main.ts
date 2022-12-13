import './assets/styles/styles.css';

import './assets/icons/_sprite.svg';
import formatter from './core/formatter';

const validElements = {
  h1: {
    convert_to: 'h2',
    valid_styles: '',
    valid_classes: '',
    no_empty: true,
  },
  'h2,h3,h4': {
    valid_styles: '',
    valid_classes: '',
    no_empty: true,
  },
  p: {
    valid_styles: 'text-align',
    valid_classes: '',
    no_empty: true,
  },
  a: {
    valid_styles: '',
    valid_classes: '',
    no_empty: true,

    process(node) {
      const host = `http://${window.location.host}/`;
      if (node.href.indexOf(host) !== 0) {
        // eslint-disable-next-line no-param-reassign
        node.target = '_blank';
      }
    },
  },
  br: {
    valid_styles: '',
    valid_classes: '',
  },
  'blockquote,b,strong,i,em,s,strike,sub,sup,kbd,ul,ol,li,dl,dt,dd,time,address,thead,tbody,tfoot':
    {
      valid_styles: '',
      valid_classes: '',
      no_empty: true,
    },
  'table,tr,th,td': {
    valid_styles: 'text-align,vertical-align',
    valid_classes: '',
    no_empty: true,
  },
  'embed,iframe': {
    valid_classes: '',
  },
};

const editor = document.getElementById('editor');

function clickHandler(event) {
  event.stopPropagation();
  event.preventDefault();

  const paste = event.clipboardData.getData('text/html');
  // paste = paste.toUpperCase();
  // const selection = window.getSelection();
  // if (!selection.rangeCount) return;

  // selection.deleteFromDocument();
  // selection.getRangeAt(0).insertNode(document.createTextNode(paste));
  // selection.collapseToEnd();

  if (editor) {
    editor.innerHTML = paste;
    formatter(editor, validElements);
  }
}

editor?.addEventListener('paste', clickHandler);
