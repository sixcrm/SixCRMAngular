export enum ColumnParamsInputType {
  NUMERIC,
  CURRENCY,
  STRING,
  BOOLEAN,
  DATE,
  AUTOCOMPLETE,
  IMAGE
}

export class ColumnParams<T> {

  label: string;
  mappingFunction: (e: T) => string | number | boolean;
  assigningFunction: (e: T, value: any) => T;
  align: string;
  sortOrder: string;
  sortApplied: boolean;
  sortEnabled: boolean = true;
  code: boolean;
  color: string;
  copy: boolean;
  number: boolean;
  translate: boolean;
  selected: boolean = true;
  inputType: ColumnParamsInputType;
  editable: boolean = true;
  showLabel: boolean = true;
  validator: (e: T) => boolean = e => true;

  autocompleteMapper: (any) => string;
  autocompleteOptions: any[];
  autocompleteInitialValue: (any) => string;

  constructor(label?: string, mappingFunction?: (e: T) => string | number | boolean, align?: string, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.align = align || 'left';
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }

  setLabel(value: string) {
    this.label = value;

    return this;
  }

  setMappingFunction(value: (e: T) => string | number | boolean) {
    this.mappingFunction = value;

    return this;
  }

  setAssigningFunction(value: (e: T, value: any) => T) {
    this.assigningFunction = value;

    return this;
  }

  setAlign(value: string) {
    this.align = value;

    return this;
  }

  setSortOrder(value: string) {
    this.sortOrder = value;

    return this;
  }

  setSortApplied(value: boolean) {
    this.sortApplied = value;

    return this;
  }

  setSortEnabled(value: boolean) {
    this.sortEnabled = value;

    return this;
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

  setSelected(value: boolean) {
    this.selected = value;

    return this;
  }

  setInputType(value: ColumnParamsInputType) {
    this.inputType = value;

    return this;
  }

  setEditable(value: boolean) {
    this.editable = value;

    return this;
  }

  setAutocompleteOptions(value: any[]) {
    this.autocompleteOptions = value;

    return this;
  }

  setAutocompleteInitialValue(value: any) {
    this.autocompleteInitialValue = value;

    return this;
  }

  setAutocompleteMapper(value: (any) => string) {
    this.autocompleteMapper = value;

    return this;
  }

  setShowLabel(value: boolean) {
    this.showLabel = value;

    return this;
  }

  setValidator(value: (e: T) => boolean) {
    this.validator = value;

    return this;
  }
}
