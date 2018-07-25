import {MatDialogRef} from '@angular/material';
import {utc, Moment} from 'moment';
import {
  ValueFilter, ValueFilterOperator,
  ValueFilterColumn
} from '../shared/components/value-filter/value-filter.component';
import {LocationFilter} from '../shared/components/location-filter/location-filter.component';

export class AbstractFilterDialog<T> {

  date: {start: Moment, end: Moment} = { start: utc().subtract(1, 'M'), end: utc()};

  filterColumns: ValueFilterColumn[] = [];

  filters: ValueFilter[] = [];

  locations: LocationFilter[] = [];

  constructor(protected dialogRef: MatDialogRef<T>) {};

  close() {
    this.dialogRef.close(null);
  }

  filter() {
    this.dialogRef.close({filters: []});
  }

  save() {
    this.dialogRef.close({filters: []});
  }

  dateSelected(date: {start: Moment, end: Moment}) {
    this.date = {start: date.start.clone(), end: date.end.clone()};
  }

  addFilter() {
    this.filters = [...this.filters, {column: this.filterColumns[0], operator: ValueFilterOperator.GREATER, value: ''}];
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
}