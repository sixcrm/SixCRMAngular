export class ColumnParams<T> {

  label: string;
  mappingFunction: (e: T) => string | number;
  align: string;
  sortOrder: string;
  sortApplied: boolean;
  code: boolean;
  color: string;
  copy: boolean;
  number: boolean;
  translate: boolean;

  constructor(label?: string, mappingFunction?: (e: T) => string | number, align?: string, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.align = align || 'left';
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }

  setCode(value: boolean) {
    this.code = value;

    return this;
  }

  setColor(value: string) {
    this.color = value;

    return this;
  }

  setCopyOption(value: boolean) {
    this.copy = value;

    return this;
  }

  setNumberOption(value: boolean) {
    this.number = value;

    return this;
  }

  setTranslateOption(value: boolean) {
    this.translate = value;

    return this;
  }
}
