import './assets/styles/main.scss';

import Toolbar from './toolbar/toolbar';
import eventEmitter from './event-emitter';

// eslint-disable-next-line no-new
new Toolbar({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  element: document.querySelector(`#toolbar`)!,
  controls: [
    'bold-01',
    'italic-01',
    'underline-01',
    'strikethrough-01',
    'align',
    'corner-up-left',
    'corner-up-right',
    'x-close',
  ],
});

// Этот вызов активирует кнопки bold и italic
setTimeout(() => {
  eventEmitter.emit(`toolbar.active`, [`bold-01`, `italic-01`, `align-center`]);
}, 100);
