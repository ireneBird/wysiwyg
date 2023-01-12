// eslint-disable-next-line import/no-cycle
import { Undo } from './commands/undo';
// eslint-disable-next-line import/no-cycle
import { Redo } from './commands/redo';
import eventEmitter from '../event-emitter';

export const CAPACITY = 20;
const emitter = eventEmitter;
const undo = new Undo();
const redo = new Redo();

export { undo, redo };
