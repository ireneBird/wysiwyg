export interface Command<T> {
  execute(element?: SavedData<T>): SavedData<T> | unknown;
}

export interface Stack<T> {
  stack: SavedData<T>[];
  readonly capacity: number;
  push(element: SavedData<T>);
  pop(): SavedData<T> | undefined;
}

export interface SavedData<T> {
  element: T;
  optionsForRestorePosition:
    | { length: number; selection: Selection; context: Node }
    | undefined;
}
