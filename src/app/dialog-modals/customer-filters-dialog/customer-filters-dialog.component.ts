import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';
import {Moment} from 'moment';

@Component({
  selector: 'customer-filters-dialog',
  templateUrl: './customer-filters-dialog.component.html',
  styleUrls: ['./customer-filters-dialog.component.scss']
})
export class CustomerFiltersDialogComponent extends AbstractFilterDialog<CustomerFiltersDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<CustomerFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'sale', label: 'Sale Amount' },
      { name: 'first_name', label: 'First Name' },
      { name: 'last_name', label: 'Last Name' }
    ];

    this.filters = [{column: this.filterColumns[0], operator: ValueFilterOperator.GREATER, value: ''}];

    this.locations = [{country: 'United States', state: ''}];
  }

  ngOnInit() {
  }

  init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]) {

  }
}
