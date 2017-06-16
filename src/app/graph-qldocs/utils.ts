import {TypeRef} from './models/type-ref.model';

export function navigateToField(type: TypeRef): void {
  let path = type.name || type.ofType.name || type.ofType.ofType.name;

  if (path) {
    let el = document.querySelector('#' + path);
    if (el) {
      el.scrollIntoView(el);
    }
  }
}
