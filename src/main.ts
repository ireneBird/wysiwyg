import './assets/styles/main.scss';
import { Wysiwyg } from './init';

const editor = new Wysiwyg({
  selector: `.editor`,
  toolbar: [
    'blocks',
    'fonts',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'align',
    'undo',
    'redo',
  ],
});
