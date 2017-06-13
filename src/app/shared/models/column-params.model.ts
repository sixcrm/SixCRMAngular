export class ColumnParams<T> {

  label: string;
  mappingFunction: (e: T) => string | number;
  align: string;
  sortOrder: string;
  sortApplied: boolean;
  code: boolean;

  constructor(label?: string, mappingFunction?: (e: T) => string | number, align?: string, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.align = align || 'left';
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }

  setCode(value: boolean): ColumnParams<T> {
    this.code = value;
    return this;
  }
}
