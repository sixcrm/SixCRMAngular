export class ColumnParams<T> {

  label: string;
  mappingFunction: (e: T) => string | number;
  sortOrder: string;
  sortApplied: boolean;

  constructor(label?: string, mappingFunction?: (e: T) => string | number, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }
}
