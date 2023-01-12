export interface Command<T> {
  execute(element?): T | unknown;
}

export interface Stack<T> {
  stack: T[];
  readonly capacity: number;
  push(element: T);
  pop(): T | undefined;
}
