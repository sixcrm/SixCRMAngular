export function getValueOf(obj, key): any {
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].key === key) {
      return obj[i].value;
    }
  }

  return '';
}