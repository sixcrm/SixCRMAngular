import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';
import {Moment} from 'moment';

@Component({
  selector: 'shippingreceipt-filters-dialog',
  templateUrl: './shippingreceipt-filters-dialog.component.html',
  styleUrls: ['./shippingreceipt-filters-dialog.component.scss']
})
export class ShippingreceiptFiltersDialogComponent extends AbstractFilterDialog<ShippingreceiptFiltersDialogComponent> implements OnInit {

  allStatus: boolean = true;
  pendingStatus: boolean;
  shippedStatus: boolean;
  deliveredStatus: boolean;
  errorStatus: boolean;

  constructor(dialogRef: MatDialogRef<ShippingreceiptFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      {name: 'fulfillment', label: 'Fulfillment'},
      {name: 'trackingId', label: 'Tracking ID'},
      {name: 'orderAlias', label: 'Order ID'},
      {name: 'customer', label: 'Customer'},
      {name: 'address', label: 'Delivery Address'}
    ];
  }

  ngOnInit() {
  }

  init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]) {
    this.date = {start: start, end: end};

    (filters || []).forEach(filter => {
      this.initStatuses(filter);
      this.initValues(filter);
    });

    if (this.filters.length === 0) {
      this.filters.push({column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''});
    }
  }

  private initStatuses(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'status') {
      this.allStatus = false;

      filter.values.forEach(v => {
        switch (v) {
          case 'pending': {
            this.pendingStatus = true;
            break;
          }
          case 'shipped': {
            this.shippedStatus = true;
            break;
          }
          case 'delivered': {
            this.deliveredStatus = true;
            break;
          }
          case 'error': {
            this.errorStatus = true;
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

      if (this.pendingStatus) {
        statusFacet.values.push('pending');
      }
      if (this.shippedStatus) {
        statusFacet.values.push('shipped');
      }
      if (this.deliveredStatus) {
        statusFacet.values.push('delivered');
      }
      if (this.errorStatus) {
        statusFacet.values.push('error');
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
      this.pendingStatus = false;
      this.shippedStatus = false;
      this.deliveredStatus = false;
      this.errorStatus = false;
    }
  }

  singleStatusSelected(event) {
    if (event.checked) {
      this.allStatus = false;
    }
  }
}