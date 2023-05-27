import {
  SavedData as SavedDataInterface,
  Stack as StackInterface,
} from '../interfaces';

class Stack<T> implements StackInterface<T> {
  readonly stack: SavedDataInterface<T>[] = [];

  current = 0;

  size = 0;

  readonly capacity: number;

  constructor(capacity) {
    this.capacity = capacity;
    this.stack = new Array(this.capacity);
  }

  get length(): number {
    return this.size;
  }

  get isEmpty(): boolean {
    return this.size === 0;
  }

  push(element: SavedDataInterface<T>) {
    if (this.size >= this.capacity) {
      this.current = -1;
    }

    this.current += 1;
    this.size += 1;

    this.stack[this.current] = element;
  }

  pop(): SavedDataInterface<T> | undefined {
    if (this.isEmpty) {
      return undefined;
    }

    const data = this.stack[this.current];
    delete this.stack[this.current];

    this.size -= 1;
    this.current -= 1;

    return data;
  }
}

export { Stack };
