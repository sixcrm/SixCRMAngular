import {MatDialogRef} from '@angular/material';
import {utc, Moment} from 'moment';
import {
  ValueFilter, ValueFilterOperator,
  ValueFilterColumn
} from '../shared/components/value-filter/value-filter.component';
import {LocationFilter} from '../shared/components/location-filter/location-filter.component';
import {firstIndexOf} from '../shared/utils/array.utils';

export interface FilterDialogResponse {
  start: Moment;
  end: Moment;
  filters: {facet: string, values: string[]}[]
}

export abstract class AbstractFilterDialog<T> {

  date: {start: Moment, end: Moment} = { start: utc().subtract(7, 'd'), end: utc()};

  filterColumns: ValueFilterColumn[] = [];

  filters: ValueFilter[] = [];

  locations: LocationFilter[] = [];

  saveAsMode: boolean = false;

  constructor(protected dialogRef: MatDialogRef<T>) {};

  abstract init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]);

  abstract parseFilters(): FilterDialogResponse;

  close() {
    this.dialogRef.close(null);
  }

  save(data: {name: string, apply: boolean}) {
    this.dialogRef.close({filters: this.parseFilters(), meta: data});
  }

  filter() {
    this.dialogRef.close({filters: this.parseFilters()});
  }

  dateSelected(date: {start: Moment, end: Moment}) {
    this.date = {start: date.start.clone(), end: date.end.clone()};
  }

  addFilter() {
    this.filters = [...this.filters, {column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''}];
  }

  removeFilterAtIndex(index) {
    this.filters.splice(index, 1);
  }

  addLocation() {
    this.locations = [...this.locations, {country: 'United States', state: ''}];
  }

  removeLocationAtIndex(index) {
    this.locations.splice(index, 1);
  }

  setSaveAs(value: boolean) {
    this.saveAsMode = value;
  }

  initValues(filter: {facet: string, values: string[]}) {
    const index = firstIndexOf(this.filterColumns, (el) => el.name === filter.facet);

    if (index !== -1) {
      filter.values.forEach(value => {
        this.filters = [...this.filters, {column: this.filterColumns[index], operator: ValueFilterOperator.EQUALS, value}]
      })
    }
  }

  parseValueFilters(): {facet: string, values: string[]}[] {
    const filters: {facet: string; values: string[]}[] = [];

    this.filters
      .filter(filter => !!(filter.value || '').trim())
      .forEach(filter => {
        const index = firstIndexOf(filters, (f) => f.facet === filter.column.name);

        if (index !== -1) {
          filters[index].values.push(filter.value);
        } else {
          filters.push({facet: filter.column.name, values: [filter.value]})
        }
      });

    return filters;
  }
}