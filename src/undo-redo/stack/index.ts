import { Stack as StackInterface } from '../interfaces';

class Stack<T> implements StackInterface<T> {
  readonly stack: T[] = [];

  readonly capacity: number;

  constructor(capacity) {
    this.capacity = capacity;
  }

  push(element: T) {
    if (this.stack.length === this.capacity) {
      this.stack.shift();
    }

    this.stack.push(element);
  }

  pop(): T | undefined {
    if (this.stack.length > 0) {
      return this.stack.pop();
    }

    return undefined;
  }
}

export { Stack };
