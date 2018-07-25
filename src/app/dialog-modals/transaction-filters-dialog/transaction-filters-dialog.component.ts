import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { ValueFilterOperator } from '../../shared/components/value-filter/value-filter.component';
import {AbstractFilterDialog} from '../abstract-filter-dialog';

@Component({
  selector: 'transaction-filters-dialog',
  templateUrl: './transaction-filters-dialog.component.html',
  styleUrls: ['./transaction-filters-dialog.component.scss']
})
export class TransactionFiltersDialogComponent extends AbstractFilterDialog<TransactionFiltersDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<TransactionFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'sale', label: 'Sale Amount' },
      { name: 'response', label: 'Response' }
    ];

    this.filters = [{column: this.filterColumns[0], operator: ValueFilterOperator.GREATER, value: ''}];

    this.locations = [{country: 'United States', state: ''}];
  }

  ngOnInit() {
  }

}
