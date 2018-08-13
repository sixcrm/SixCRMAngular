import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {Moment} from 'moment';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';

@Component({
  selector: 'order-filters-dialog',
  templateUrl: './order-filters-dialog.component.html',
  styleUrls: ['./order-filters-dialog.component.scss']
})
export class OrderFiltersDialogComponent extends AbstractFilterDialog<OrderFiltersDialogComponent> implements OnInit {

  allStatus: boolean = true;
  shippedStatus: boolean;
  closedStatus: boolean;
  errorsStatus: boolean;
  refundsStatus: boolean;
  returnsStatus: boolean;
  chargebacksStatus: boolean;

  constructor(dialogRef: MatDialogRef<OrderFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'amount', label: 'Sale Amount' },
      { name: 'customerName', label: 'Customer Name' }
    ];
  }

  ngOnInit() { }

  init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]) {
    this.date = {start: start, end: end};

    (filters || []).forEach(filter => {
      this.initStatuses(filter);

      this.initValues(filter);
    });

    this.filters.push({column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''});
  }

  private initStatuses(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'status') {
      this.allStatus = false;

      filter.values.forEach(v => {
        switch (v) {
          case 'shipped': {
            this.shippedStatus = true;
            break;
          }
          case 'closed': {
            this.closedStatus = true;
            break;
          }
          case 'errors': {
            this.errorsStatus = true;
            break;
          }
          case 'refunds': {
            this.refundsStatus = true;
            break;
          }
          case 'returns': {
            this.returnsStatus = true;
            break;
          }
          case 'chargebacks': {
            this.chargebacksStatus = true;
            break;
          }
        }

      })
    }
  }

  parseFilters(): FilterDialogResponse {
    let filters: {facet: string, values: string[]}[] = [
      ...this.parseStatusFilters(),
      ...this.parseValueFilters()
    ];

    return {
      start: this.date.start.clone(),
      end: this.date.end.clone(),
      filters: filters
    }
  }

  private parseStatusFilters(): {facet: string, values: string[]}[] {
    if (!this.allStatus) {

      const statusFacet = {facet: 'status', values: []};

      if (this.shippedStatus) {
        statusFacet.values.push('shipped');
      }
      if (this.closedStatus) {
        statusFacet.values.push('closed');
      }
      if (this.errorsStatus) {
        statusFacet.values.push('errors');
      }
      if (this.refundsStatus) {
        statusFacet.values.push('refunds');
      }
      if (this.returnsStatus) {
        statusFacet.values.push('returns');
      }
      if (this.chargebacksStatus) {
        statusFacet.values.push('chargebacks');
      }

      if (statusFacet.values.length > 0) {
        return [statusFacet];
      }

    }

    return [];
  }

  allStatusSelected(event) {
    if (event.checked) {
      this.shippedStatus = false;
      this.closedStatus = false;
      this.errorsStatus = false;
      this.refundsStatus = false;
      this.returnsStatus = false;
      this.chargebacksStatus = false;
    }
  }

  singleStatusSelected(event) {
    if (event.checked) {
      this.allStatus = false;
    }
  }

}
