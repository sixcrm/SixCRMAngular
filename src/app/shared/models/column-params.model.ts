export class ColumnParams<T> {

  label: string;
  mappingFunction: (e: T) => string;
  sortOrder: string;
  sortApplied: boolean;

  constructor(label?: string, mappingFunction?: (e: T) => string, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }
}
