import './assets/styles/main.scss';
import { Wysiwyg } from './init';
// // eslint-disable-next-line no-new
// new Editor({ element: document.querySelector(`#editor`)! });
// // eslint-disable-next-line no-new
// new Toolbar({
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   element: document.querySelector(`#toolbar`)!,
//   controls: [
//     'blocks',
//     'fonts',
//     'bold',
//     'italic',
//     'underline',
//     'strikeThrough',
//     'align',
//     'corner-up-left',
//     'corner-up-right',
//     'x-close',
//   ],
// });

// eslint-disable-next-line no-new
new Wysiwyg({
  selector: `.editor`,
  toolbar: [
    'blocks',
    'fonts',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'align',
  ],
});
