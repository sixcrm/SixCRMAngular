import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';
import { ValueFilterOperator } from '../../shared/components/value-filter/value-filter.component';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {Moment} from 'moment';

@Component({
  selector: 'transaction-filters-dialog',
  templateUrl: './transaction-filters-dialog.component.html',
  styleUrls: ['./transaction-filters-dialog.component.scss']
})
export class TransactionFiltersDialogComponent extends AbstractFilterDialog<TransactionFiltersDialogComponent> implements OnInit {

  allStatus: boolean = true;
  refundStatus: boolean;
  saleStatus: boolean;
  reverseStatus: boolean;

  allResponse: boolean = true;
  declineResponse: boolean;
  errorResponse: boolean;
  successResponse: boolean;
  failResponse: boolean;

  constructor(dialogRef: MatDialogRef<TransactionFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'amount', label: 'Sale Amount' },
      { name: 'customerName', label: 'Customer Name' },
      { name: 'rebillAlias', label: 'Order Alias' },
      { name: 'sessionAlias', label: 'Session Alias' },
      { name: 'merchantProviderName', label: 'MID Name' },
      { name: 'alias', label: 'Transaction Alias' }
    ];
  }

  ngOnInit() { }

  init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]) {
    this.date = {start: start, end: end};

    (filters || []).forEach(filter => {
      this.initResponses(filter);

      this.initStatuses(filter);

      this.initValues(filter);
    });

    if (this.filters.length === 0) {
      this.filters.push({column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''});
    }
  }

  private initStatuses(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'transactionType') {
      this.allStatus = false;

      filter.values.forEach(v => {
        switch (v) {
          case 'sale': {
            this.saleStatus = true;
            break;
          }
          case 'refund': {
            this.refundStatus = true;
            break;
          }
          case 'reverse': {
            this.reverseStatus = true;
            break;
          }
        }

      })
    }
  }

  private initResponses(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'response') {
      this.allResponse = false;

      filter.values.forEach(v => {
        switch (v) {
          case 'decline': {
            this.declineResponse = true;
            break;
          }
          case 'error': {
            this.errorResponse = true;
            break;
          }
          case 'fail': {
            this.failResponse = true;
            break;
          }
          case 'success': {
            this.successResponse = true;
            break;
          }
        }

      })
    }
  }

  parseFilters(): FilterDialogResponse {
    let filters: {facet: string, values: string[]}[] = [
      ...this.parseStatusFilters(),
      ...this.parseResponseFilters(),
      ...this.parseValueFilters()
    ];

    return {
      start: this.date.start.clone(),
      end: this.date.end.clone(),
      filters: filters
    }
  }

  private parseResponseFilters(): {facet: string, values: string[]}[] {
    if (!this.allResponse) {

      const responseFacet = {facet: 'response', values: []};

      if (this.declineResponse) {
        responseFacet.values.push('decline');
      }
      if (this.errorResponse) {
        responseFacet.values.push('error');
      }
      if (this.successResponse) {
        responseFacet.values.push('success');
      }
      if (this.failResponse) {
        responseFacet.values.push('fail');
      }

      if (responseFacet.values.length > 0) {
        return [responseFacet];
      }
    }

    return [];
  }

  private parseStatusFilters(): {facet: string, values: string[]}[] {
    if (!this.allStatus) {
      const typeFacet = {facet: 'transactionType', values: []};

      if (this.refundStatus) {
        typeFacet.values.push('refund');
      }

      if (this.saleStatus) {
        typeFacet.values.push('sale');
      }

      if (this.reverseStatus) {
        typeFacet.values.push('reverse');
      }

      if (typeFacet.values.length > 0) {
        return [typeFacet];
      }
    }

    return [];
  }

  allStatusSelected(event) {
    if (event.checked) {
      this.saleStatus = false;
      this.refundStatus = false;
      this.reverseStatus = false;
    }
  }

  singleStatusSelected(event) {
    if (event.checked) {
      this.allStatus = false;
    }
  }

  allResponseSelected(event) {
    if (event.checked) {
      this.declineResponse = false;
      this.errorResponse = false;
      this.failResponse = false;
      this.successResponse = false;
    }
  }

  singleResponseSelected(event) {
    if (event.checked) {
      this.allResponse = false;
    }
  }

}
