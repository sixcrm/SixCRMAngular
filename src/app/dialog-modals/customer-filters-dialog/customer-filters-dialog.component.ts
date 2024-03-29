import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';
import {Moment} from 'moment';
import {stateName, stateCode, countryCode, countryName} from '../../shared/utils/address.utils';

@Component({
  selector: 'customer-filters-dialog',
  templateUrl: './customer-filters-dialog.component.html',
  styleUrls: ['./customer-filters-dialog.component.scss']
})
export class CustomerFiltersDialogComponent extends AbstractFilterDialog<CustomerFiltersDialogComponent> implements OnInit {

  allStatus: boolean = true;
  activeStatus: boolean;
  partialStatus: boolean;

  constructor(dialogRef: MatDialogRef<CustomerFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'firstname', label: 'First Name' },
      { name: 'lastname', label: 'Last Name' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'city', label: 'City' },
      { name: 'zip', label: 'Postal Code' }
    ];
  }

  ngOnInit() {

  }

  init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]) {
    (filters || []).forEach(filter => {
      this.initStatuses(filter);

      if (filter.facet === 'country' || filter.facet === 'state') {
        this.initLocation(filter);
      } else {
        this.initValues(filter);
      }
    });

    if (this.locations.length === 0) {
      this.locations.push({country: 'United States', state: ''});
    }

    if (this.filters.length === 0) {
      this.filters.push({column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''});
    }
  }

  private initLocation(filter: {facet: string; values: string[]}) {

    for (let i = 0; i < filter.values.length; i++) {
      if (!this.locations[i]) {
        this.locations.push({country: '', state: ''})
      }

      const value = filter.values[i];

      if (filter.facet === 'country') {
        this.locations[i].country = countryName(value);
      }

      if (filter.facet === 'state') {
        this.locations[i].state = stateName(value);
      }
    }

  }

  private initStatuses(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'customerStatus') {
      this.allStatus = false;

      filter.values.forEach(v => {
        switch (v) {
          case 'active': {
            this.activeStatus = true;
            break;
          }
          case 'partial': {
            this.partialStatus = true;
            break;
          }
        }

      })
    }
  }

  parseFilters(): FilterDialogResponse {
    let filters: {facet: string, values: string[]}[] = [
      ...this.parseStatusFilters(),
      ...this.parseValueFilters(),
      ...this.parseLocations()
    ];

    return {
      start: null,
      end: null,
      filters: filters
    }
  }

  parseLocations(): {facet: string, values: string[]}[] {
    if (!this.locations || this.locations.length === 0) return [];

    const countryFilter = { facet: 'country', values: []};
    const stateFilter = { facet: 'state', values: []};

    this.locations.filter(c => c.country && c.state).forEach(location => {
      countryFilter.values.push(countryCode(location.country));
      stateFilter.values.push(stateCode(location.state));
    });

    if (countryFilter.values.length === 0 || stateFilter.values.length === 0) return [];

    return [stateFilter, countryFilter];
  }

  private parseStatusFilters(): {facet: string, values: string[]}[] {
    if (!this.allStatus) {

      const statusFacet = {facet: 'customerStatus', values: []};

      if (this.activeStatus) {
        statusFacet.values.push('active');
      }
      if (this.partialStatus) {
        statusFacet.values.push('partial');
      }

      if (statusFacet.values.length > 0) {
        return [statusFacet];
      }

    }

    return [];
  }

  allStatusSelected(event) {
    if (event.checked) {
      this.activeStatus = false;
      this.partialStatus = false;
    }
  }

  singleStatusSelected(event) {
    if (event.checked) {
      this.allStatus = false;
    }
  }
}
