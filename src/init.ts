import Editor from './editor';
import Toolbar from './toolbar/toolbar';
import { renderElement } from './helpers';
import { UndoRedo } from './undo-redo';
import { HotKeys } from './hot-keys';

export type InitOptions = {
  selector: string;
  toolbar?: string[];
};

class Wysiwyg {
  readonly #wrapper: HTMLElement;

  #toolbarElement: HTMLDivElement;

  #editorElement: HTMLDivElement;

  #footerElement: HTMLDivElement;

  readonly #toolbarOptions?: string[];

  #defaultToolbarOptions: string[] = [
    'blocks',
    'fonts',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'align',
    'undo',
    'redo',
    'x-close',
  ];

  constructor({ selector, toolbar }: InitOptions) {
    this.#wrapper = document.querySelector(selector) as HTMLElement;
    this.#toolbarOptions = toolbar;

    if (this.#wrapper) {
      this.#renderElements();
      this.#init();
    } else {
      throw new Error(`Element not found`);
    }
  }

  #renderElements() {
    if (this.#wrapper) {
      renderElement(
        this.#wrapper,
        `<div class='panel'>
          <div class="toolbar" id='toolbar'></div>
        </div>`,
      );

      renderElement(
        this.#wrapper,
        `<div class='playground-wrap'>
          <div class='playground' id='editor' contenteditable='true'></div>
        </div>`,
      );

      renderElement(
        this.#wrapper,
        `<div class="footer" id='footer'><span>words: 0</span></div>`,
      );

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#toolbarElement = this.#wrapper.querySelector(`#toolbar`)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#editorElement = this.#wrapper.querySelector(`#editor`)!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.#footerElement = this.#wrapper.querySelector(`#footer`)!;
    }
  }

  #init() {
    // eslint-disable-next-line no-new
    new Editor({ element: this.#editorElement });
    // eslint-disable-next-line no-new
    new Toolbar({
      element: this.#toolbarElement,
      controls: this.#toolbarOptions
        ? this.#toolbarOptions
        : this.#defaultToolbarOptions,
    });
    // eslint-disable-next-line no-new
    new UndoRedo({ element: this.#editorElement });
    // eslint-disable-next-line no-new
    new HotKeys({ element: this.#editorElement });
  }
}

export { Wysiwyg };
