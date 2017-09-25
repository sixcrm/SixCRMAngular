import {Entity} from '../models/entity.interface';

export function areEntitiesIdentical(first: Entity<any>, second: Entity<any>): boolean {
  let f = first.copy();
  let s = second.copy();

  delete f['createdAt'];
  delete f['updatedAt'];

  delete s['createdAt'];
  delete s['updatedAt'];

  const fString = JSON.stringify(f);
  const sString = JSON.stringify(s);

  return fString === sString;
}
