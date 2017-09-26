import {Entity} from '../models/entity.interface';

export function areEntitiesIdentical(first: Entity<any>, second: Entity<any>): boolean {
  let f = deleteFields(deleteFields(first.copy(), 'createdAt'), 'updatedAt');
  let s = deleteFields(deleteFields(second.copy(), 'createdAt'), 'updatedAt');

  const fString = JSON.stringify(f);
  const sString = JSON.stringify(s);

  return fString === sString;
}

function deleteFields(entity: any, fieldName: string): any {
  delete entity[fieldName];

  Object.keys(entity).forEach(key => {
    if (entity[key] instanceof Object) {
      entity[key] = deleteFields(entity[key], fieldName);
    }
  });

  return entity;
}
