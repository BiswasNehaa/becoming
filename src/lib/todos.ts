/**
 * A flat, rolling to-do list rather than one list per day: an item stays
 * "open" — and keeps showing up — until it's checked off or removed,
 * regardless of which day it was added on. `completedDate` is only used
 * to decide what counts toward "done today" and to fade older completed
 * items out of the list.
 */
export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
  createdDate: string;
  completedDate?: string;
};
