import './assets/styles/main.scss';

import Toolbar from './toolbar/toolbar';
import Editor from './editor';

// eslint-disable-next-line no-new
new Toolbar({
  element: document.querySelector(`#toolbar`)!,
  controls: [
    'bold-01',
    'italic-01',
    'underline-01',
    'strikethrough-01',
    'align-center',
    'align-justify',
    'align-left',
    'align-right',
    'corner-up-left',
    'corner-up-right',
    'x-close',
  ],
});

// eslint-disable-next-line no-new
new Editor({ element: document.querySelector(`#editor`)! });
