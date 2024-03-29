import {Currency} from '../utils/currency/currency';
export enum ColumnParamsInputType {
  NUMERIC,
  CURRENCY,
  STRING,
  BOOLEAN,
  DATE,
  AUTOCOMPLETE,
  MULTISELECT,
  IMAGE
}

export class ColumnParams<T> {

  label: string;
  mappingFunction: (e: T) => string | number | boolean | Currency;
  assigningFunction: (e: T, value: any) => T;
  align: string;
  sortName: string;
  sortOrder: string;
  sortApplied: boolean;
  sortEnabled: boolean = true;
  code: boolean;
  colorMapper: (any) => string = (el) => 'black';
  copy: boolean;
  number: boolean;
  translate: boolean;
  selected: boolean = true;
  inputType: ColumnParamsInputType;
  editable: boolean = true;
  showLabel: boolean = true;
  capitalize: boolean;
  validator: (e: T) => boolean = e => true;

  autocompleteMapper: (any) => string = e => e;
  autocompleteOptions: any[];
  autocompleteInitialValue: (T) => string;

  autofocus: boolean;
  separator: boolean;

  materialIconMapper: (any) => string;
  materialIconColorMapper: (any) => string;
  materialIconBackgroundColorMapper: (any) => string;

  imageMapper: (any) => string;

  link: (any) => string;
  queryParams: (any) => any = (_) => {};
  fragment: (any) => string = (_) => '';

  maskLongData: boolean;

  constructor(label?: string, mappingFunction?: (e: T) => string | number | boolean, align?: string, order?: string, applied?: boolean) {
    this.label = label;
    this.mappingFunction = mappingFunction;
    this.align = align || 'left';
    this.sortOrder = order || 'asc';
    this.sortApplied = applied || false;
  }

  setImageMapper(value: (any) => string) {
    this.imageMapper = value;

    return this;
  }

  setMaterialIconMapper(value: (any) => string) {
    this.materialIconMapper = value;

    return this;
  }

  setMaterialIconBackgroundColorMapper(value: (any) => string) {
    this.materialIconBackgroundColorMapper = value;

    return this;
  }

  setMaterialIconColorMapper(value: (any) => string) {
    this.materialIconColorMapper = value;

    return this;
  }

  setCapitalize(value: boolean) {
    this.capitalize = value;

    return this;
  }

  setLink(value: (any) => string) {
    this.link = value;

    return this;
  }

  setFragment(value: (any) => string) {
    this.fragment = value;

    return this;
  }

  setQueryParams(value: (any) => any) {
    this.queryParams = value;

    return this;
  }

  setSeparator(value: boolean) {
    this.separator = value;

    return this;
  }

  setLabel(value: string) {
    this.label = value;

    return this;
  }

  setMappingFunction(value: (e: T) => string | number | boolean | Currency) {
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

  setColorMapper(value: (any) => string) {
    this.colorMapper = value;

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

  setAutofocus(value: boolean) {
    this.autofocus = value;

    return this;
  }

  setSortName(value: string) {
    this.sortName = value;

    return this;
  }

  setMaskLongData(value: boolean) {
    this.maskLongData = value;

    return this;
  }
}
