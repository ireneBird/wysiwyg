import './assets/styles/main.scss';

import './assets/icons/_sprite.svg';

import { render } from 'pug';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const test = require('./views/ui/test.pug');

const testElement = document.getElementById('test');
const output = render(test);
// console.log(output);
