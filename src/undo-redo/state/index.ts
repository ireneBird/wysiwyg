import { History } from './history';
import { Trash } from './trash';

const MAX_CAPACITY = 30;

const history = new History(MAX_CAPACITY);
const trash = new Trash(MAX_CAPACITY);

export { history, trash };
