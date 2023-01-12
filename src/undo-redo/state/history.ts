import { Stack } from '../stack';
import { CAPACITY } from '../index';

class History<T> extends Stack<T> {}
const history = new History(CAPACITY);

export { history };
