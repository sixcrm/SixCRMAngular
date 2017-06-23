export function firstIndexOf(array: any[], equals: (el) => boolean) {
  if (!array || array.length === 0) return -1;

  for (let i = 0; i < array.length; i++) {
    if (equals(array[i])) return i;
  }

  return -1;
}
