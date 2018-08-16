import {Moment} from 'moment';

export function firstIndexOf(array: any[], equals: (el) => boolean) {
  if (!array || array.length === 0) return -1;

  for (let i = 0; i < array.length; i++) {
    if (equals(array[i])) return i;
  }

  return -1;
}

export function sortByCreatedAtFn(order?: 'asc' | 'desc'): (a: {createdAt: Moment}, b: {createdAt: Moment}) => number {

  return (a: {createdAt: Moment}, b: {createdAt: Moment}) => {
    if (a.createdAt.isBefore(b.createdAt)) {
      return (!order || order === 'asc') ? -1 : 1;
    }

    if (a.createdAt.isAfter(b.createdAt)) {
      return (!order || order === 'asc') ? 1 : -1;
    }

    return 0;
  }

}
