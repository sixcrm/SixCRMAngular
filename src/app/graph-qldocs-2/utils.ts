import {TypeRef} from './models/type-ref.model';
import {Type} from './models/type.model';
import {Field} from './models/field.model';

export function navigateToField(type: TypeRef): void {
  let path = type.name || type.ofType.name || type.ofType.ofType.name;

  if (path) {
    let el = document.querySelector('#' + path);
    if (el) {
      el.scrollIntoView();
    }
  }
}

export function navigateToFieldByString(path: string): void {
  let el = document.querySelector('#' + path);
  if (el) {
    el.scrollIntoView();
  }
}

export function sortTypes(a: Type, b: Type) {
  // query should be on top of the list, then mutation, and then sort alphabetically
  if (a.name === 'Query') return -1;
  if (b.name === 'Query') return 1;

  if (a.name === 'Mutation') return -1;
  if (b.name === 'Mutation') return 1;

  if (a.name < b.name) return -1;

  if (a.name > b.name) return 1;

  return 0;
}

export function sortFields(a: Field, b: Field) {
  if (a.name < b.name) return -1;

  if (a.name > b.name) return 1;

  return 0;
}
