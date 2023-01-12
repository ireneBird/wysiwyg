import { Stack } from '../stack';
import { CAPACITY } from '../index';

class Trash<T> extends Stack<T> {}
const trash = new Trash(CAPACITY);

export { trash };
