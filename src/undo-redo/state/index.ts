import { History } from './history';
import { Trash } from './trash';

const history = new History(10);
const trash = new Trash(10);

export { history, trash };
