import './assets/styles/main.scss';

import Toolbar from './toolbar/toolbar';
import Editor from './editor';

// eslint-disable-next-line no-new
new Editor({ element: document.querySelector(`#editor`)! });
// eslint-disable-next-line no-new
new Toolbar({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  element: document.querySelector(`#toolbar`)!,
  controls: [
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'align',
    'corner-up-left',
    'corner-up-right',
    'x-close',
  ],
});

// Этот вызов активирует кнопки bold и italic
// setTimeout(() => {
//   eventEmitter.emit(`toolbar.active`, [`bold`, `italic`, `align-center`]);
// }, 100);
