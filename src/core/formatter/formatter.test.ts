/* eslint-disable no-param-reassign */
import * as fs from 'fs';
import * as path from 'path';
import { JSDOM } from 'jsdom';
import formatter from './formatter';

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
let dom;

function test(input, output, config) {
  const testNode = dom.window.document.createElement('div');
  testNode.innerHTML = input;
  formatter(testNode, config);

  return testNode.innerHTML === output;
}

describe('Html formating lib', () => {
  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: 'dangerously' });
  });

  it('Текст без редактуры', () => {
    const input =
      '<h1>Hello, World!</h1><p style="text-align: center;">It\'s a test!</p>';
    const output = input;
    const config = {
      h1: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
      p: {
        validStyles: 'text-align',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Разрешенные стили', () => {
    const input =
      '<h1>Hello, World!</h1>' +
      '<p style="text-align: center; font-size: 1.1em; line-height: 1.3; color: gray;">It\'s a test!</p>';

    const output =
      '<h1>Hello, World!</h1>' +
      '<p style="text-align: center; color: gray;">It\'s a test!</p>';

    const config = {
      h1: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
      p: {
        validStyles: 'text-align,color',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Разрешенные классы', () => {
    const input =
      '<h1 class="ui ui-title title news-title __big-title">Hello, World!</h1>' +
      '<p class="caption" style="text-align: center;">It\'s a test!</p>';

    const output =
      '<h1 class="title __big-title">Hello, World!</h1>' +
      '<p style="text-align: center;">It\'s a test!</p>';

    const config = {
      h1: {
        validStyles: '',
        validClasses: 'title __big-title',
        noEmpty: true,
      },
      p: {
        validStyles: 'text-align,color',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Удаление пустых элементов', () => {
    const input =
      '<h1>Hello, World!</h1><p style="text-align: center;">It\'s a test!</p><p>&nbsp;</p><p>Done!</p>';
    const output =
      '<h1>Hello, World!</h1><p style="text-align: center;">It\'s a test!</p><p>Done!</p>';
    const config = {
      h1: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
      p: {
        validStyles: 'text-align',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Удаление идентификаторов и неразрывных пробелов', () => {
    const input =
      '<h1 id="article-title">Hello,&nbsp;World!</h1>' +
      '<p id="caption" style="text-align: center;">It\'s&nbsp;a&nbsp;test!</p>';

    const output =
      '<h1>Hello, World!</h1>' +
      '<p style="text-align: center;">It\'s a test!</p>';

    const config = {
      h1: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
      p: {
        validStyles: 'text-align',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Конвертирование + вложенные правила', () => {
    const input =
      '<h1><em style="font-size: 1.1em;">Hello</em>, <strong>World</strong>!</h1>' +
      '<p style="text-align: center;">It\'s a <strong>test</strong>!</p>';

    const output =
      '<h1><em>Hello</em>, World!</h1>' +
      '<p style="text-align: center;">It\'s a <strong>test</strong>!</p>';

    const config = {
      h1: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,

        config: {
          em: {
            // convertTo: 'i',
            validStyles: '',
            validClasses: '',
            noEmpty: true,
          },
        },
      },
      p: {
        validStyles: 'text-align',
        validClasses: '',
        noEmpty: true,
      },
      strong: {
        // convertTo: 'b',
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Дополнительная обработка', () => {
    const input =
      '<h1>Hello, World!</h1>' +
      '<p style="text-align: center;">' +
      'It\'s a test! Go to <a href="https://google.com">Google</a>' +
      '</p>';

    const output =
      '<h1>Hello, World!</h1>' +
      '<p style="text-align: center;">' +
      'It\'s a test! Go to <a href="https://google.com" target="_blank">Google</a>' +
      '</p>';

    const config = {
      h1: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
      p: {
        validStyles: 'text-align',
        validClasses: '',
        noEmpty: true,
      },
      a: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,

        process(node) {
          node.target = '_blank';
        },
      },
    };

    expect(test(input, output, config)).toBe(true);
  });

  it('Полноценный тест', () => {
    const input =
      '<h1 id="article-title">' +
      'Hello,<br><a style="color: blue;" href="https://msn.com/"><strong>World</strong></a>!' +
      '</h1>' +
      '<p class="caption overflow" style="text-align: center; color: gray;">' +
      'It\'s a <strong style="font-weight: normal;">good</strong> test!' +
      '</p>' +
      '<p style="text-align: center;">&nbsp;</p><br class="line-break">' +
      '<p style="text-align: center;">' +
      'Go&nbsp;<em class="text-decoration: underline;">to</em>&nbsp;' +
      '<a href="https://google.com">Google</a><strong></strong>.<br>' +
      'Done!' +
      '</p>';

    const output =
      '<h1>Hello, <a href="http://msn.com/">World</a>!</h1>' +
      '<p class="caption">It\'s a <strong>good</strong> test!</p>' +
      '<br>' +
      '<p>' +
      'Go <em class="text-decoration: underline;">to</em> ' +
      '<a href="https://google.com" target="_blank">Google</a>.<br>' +
      'Done!' +
      '</p>';

    const config = {
      h1: {
        // convertTo: 'h2',
        validStyles: '',
        validClasses: '',
        noEmpty: true,

        config: {
          a: {
            validStyles: '',
            validClasses: '',

            process(node) {
              node.href = node.href.replace('https://', 'http://');
            },
          },
          br: {
            validStyles: '',
            validClasses: '',

            process(node) {
              const parent = node.parentNode;
              const space = dom.window.document.createTextNode(' ');

              parent.replaceChild(space, node);
            },
          },
        },
      },
      p: {
        validStyles: '',
        validClasses: 'caption',
        noEmpty: true,

        config: {
          em: {
            noEmpty: true,
          },
          strong: {
            // convertTo: 'b',
            validStyles: '',
            validClasses: '',
            noEmpty: true,
          },
          a: {
            validStyles: '',
            validClasses: '',
            noEmpty: true,

            process(node) {
              node.target = '_blank';
            },
          },
          br: {
            validStyles: '',
            validClasses: '',
          },
        },
      },
      strong: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
      br: {
        validStyles: '',
        validClasses: '',
      },
      a: {
        validStyles: '',
        validClasses: '',
        noEmpty: true,
      },
    };

    expect(test(input, output, config)).toBe(true);
  });
});
