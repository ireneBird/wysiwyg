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
    'blocks',
    'fonts',
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

// Этот вызов активирует кнопки Heading 2, Arial, align-center и italic
// setTimeout(() => {
//   eventEmitter.emit(`toolbar.active`, [
//     `Heading 2`,
//     `Arial`,
//     `italic`,
//     `align-center`,
//   ]);
// }, 10000);
