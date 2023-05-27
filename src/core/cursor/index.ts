import { RestoreCursor } from './interface';

export class Cursor {
  #range: Range | undefined = undefined;

  get getRange() {
    return this.#range;
  }

  setCurrentRangeToSelection() {
    const selection = document.getSelection();

    if (selection && this.#range) {
      selection.removeAllRanges();
      selection.addRange(this.#range);
    }
  }

  setRange(newRange: Range) {
    this.#range = newRange;
  }

  getCursorPosition(): Range | undefined {
    const selection = document.getSelection();
    if (selection) {
      this.#range = selection.getRangeAt(0);

      return this.#range;
    }

    return undefined;
  }

  hasRange() {
    return !!this.#range;
  }

  // eslint-disable-next-line class-methods-use-this,consistent-return
  saveCursorPosition(context: Node) {
    const selection = window.getSelection();

    if (selection) {
      const range = selection.getRangeAt(0);
      range.setStart(context, 0);
      const { length } = range.toString();

      return {
        length,
        selection,
        context,
      };
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getTextNodeAtPosition(root: Node, index: number) {
    const NODE_TYPE = NodeFilter.SHOW_TEXT;

    let cIndex = index;

    const treeWalker = document.createTreeWalker(
      root,
      NODE_TYPE,
      function next(element) {
        if (element.textContent && cIndex > element.textContent.length) {
          cIndex -= element.textContent.length;
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      },
    );

    const node = treeWalker.nextNode();

    return {
      node: node || root,
      position: cIndex,
    };
  }

  restoreCursor({ context, length, selection }: RestoreCursor) {
    const pos = this.getTextNodeAtPosition(context, length);
    selection.removeAllRanges();
    const newRange = new Range();
    newRange.setStart(pos.node, pos.position);
    selection.addRange(newRange);
  }
}
