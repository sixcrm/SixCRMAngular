import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';

@Component({
  selector: 'shippingreceipt-filters-dialog',
  templateUrl: './shippingreceipt-filters-dialog.component.html',
  styleUrls: ['./shippingreceipt-filters-dialog.component.scss']
})
export class ShippingreceiptFiltersDialogComponent extends AbstractFilterDialog<ShippingreceiptFiltersDialogComponent> implements OnInit {

  constructor(dialogRef: MatDialogRef<ShippingreceiptFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      {name: 'cycle', label: 'Cycle'},
      {name: 'amount', label: 'Amount'},
      {name: 'status', label: 'Campaign'}
    ];

    this.filters = [{column: this.filterColumns[0], operator: ValueFilterOperator.GREATER, value: ''}];
  }

  ngOnInit() {
  }
}