export class ColumnParams {

  label: string;
  mappingFunction: (e) => string;
  sortOrder: string;
  sortApplied: boolean;

  constructor(label?: string, mappingFunction?: (e) => string, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }
}
