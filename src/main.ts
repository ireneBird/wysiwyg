import './assets/styles/styles.css';

import './assets/icons/_sprite.svg';

import emitter from './event-emitter';
import Control from './toolbar/control/control';

const eventEmitter = emitter;

eventEmitter.on(`toolbar.style.bold`, () => {
  console.log(`bold`);
});

eventEmitter.on(`toolbar.style.italic`, () => {
  console.log(`italic`);
});

const boldButton = new Control(`bold`, {
  toolbarEventName: `toolbar.style.bold`,
  editorEventName: `editor.style.bold`,
  element: document.querySelector(`#bold-01`)!,
});

setTimeout(() => {
  eventEmitter.emit(`editor.style.bold`, true);
}, 1000);
