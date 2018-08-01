import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { ValueFilterOperator } from '../../shared/components/value-filter/value-filter.component';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {firstIndexOf} from '../../shared/utils/array.utils';

@Component({
  selector: 'transaction-filters-dialog',
  templateUrl: './transaction-filters-dialog.component.html',
  styleUrls: ['./transaction-filters-dialog.component.scss']
})
export class TransactionFiltersDialogComponent extends AbstractFilterDialog<TransactionFiltersDialogComponent> implements OnInit {

  allStatus: boolean = true;
  chargebackStatus: boolean;
  refundStatus: boolean;
  saleStatus: boolean;

  allResponse: boolean = true;
  declineResponse: boolean;
  errorResponse: boolean;
  successResponse: boolean;

  constructor(dialogRef: MatDialogRef<TransactionFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'amount', label: 'Sale Amount' },
      { name: 'customer_name', label: 'Customer Name' },
      { name: 'rebill_alias', label: 'Order Alias' },
      { name: 'session_alias', label: 'Session Alias' },
      { name: 'merchant_provider_name', label: 'MID Name' },
      { name: 'alias', label: 'Transaction Alias' }
    ];

    this.filters = [{column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''}];
  }

  ngOnInit() {
  }

  parseFilters(): FilterDialogResponse {
    const filters: {facet: string, values: string[]}[] = [];

    this.filters.filter(filter => !!filter.value)
      .forEach(filter => {
        const index = firstIndexOf(filters, (f) => f.facet === filter.column.name);

        if (index !== -1) {
          filters[index].values.push(filter.value);
        } else {
          filters.push({facet: filter.column.name, values: [filter.value]})
        }

      });

    if (!this.allStatus) {
      filters.push({facet: 'chargeback', values: [this.chargebackStatus ? 'yes' : 'no']});
    }

    if (!this.allResponse) {

      const resp = {facet: 'response', values: []};

      if (this.declineResponse) {
        resp.values.push('decline');
      }
      if (this.errorResponse) {
        resp.values.push('error');
      }
      if (this.successResponse) {
        resp.values.push('success');
      }

      filters.push(resp);
    }

    return {
      start: this.date.start.clone(),
      end: this.date.end.clone(),
      filters: filters
    }
  }

  save(data: {name: string, apply: boolean}) {
    this.dialogRef.close({filters: this.parseFilters(), meta: data});
  }

  filter() {
    this.dialogRef.close({filters: this.parseFilters()});
  }

}
