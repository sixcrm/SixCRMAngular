import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';
import {Campaign} from '../../shared/models/campaign.model';
import {Moment} from 'moment';
import {CampaignsService} from '../../entity-services/services/campaigns.service';
import {campaignsNamesListQuery} from '../../shared/utils/queries/entities/campaign.queries';

@Component({
  selector: 'subscription-filters-dialog',
  templateUrl: './subscription-filters-dialog.component.html',
  styleUrls: ['./subscription-filters-dialog.component.scss']
})
export class SubscriptionFiltersDialogComponent extends AbstractFilterDialog<SubscriptionFiltersDialogComponent> implements OnInit {

  allStatus: boolean = true;
  activeStatus: boolean;
  cancelledStatus: boolean;
  inactiveStatus: boolean;

  selectedCampaigns: Campaign[] = [new Campaign()];

  campaignMapper = (campaign) => campaign ? campaign.name : '';

  constructor(dialogRef: MatDialogRef<SubscriptionFiltersDialogComponent>, public campaignsService: CampaignsService) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'cycle', label: 'Cycle' },
      { name: 'interval', label: 'Interval' },
      { name: 'saleAmount', label: 'Sale Amount' },
      { name: 'items', label: 'Items' },
      { name: 'customerName', label: 'Customer' }
    ];
  }

  ngOnInit() {
    this.campaignsService.customEntitiesQuery(campaignsNamesListQuery({}));
  }

  init(start: Moment, end: Moment, filters: {facet: string, values: string[]}[]) {
    this.date = {start: start, end: end};

    (filters || []).forEach(filter => {
      this.initStatuses(filter);

      if (filter.facet === 'campaignName') {
        this.initCampaigns(filter);
      } else {
        this.initValues(filter);
      }
    });

    if (this.filters.length === 0) {
      this.filters.push({column: this.filterColumns[0], operator: ValueFilterOperator.EQUALS, value: ''});
    }
  }

  private initCampaigns(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'campaignName') {
      this.selectedCampaigns = filter.values.map(v => new Campaign({name: v}))
    }
  }

  private initStatuses(filter: {facet: string; values: string[]}) {
    if (filter.facet === 'status') {
      this.allStatus = false;

      filter.values.forEach(v => {
        switch (v) {
          case 'active': {
            this.activeStatus = true;
            break;
          }
          case 'canceled': {
            this.cancelledStatus = true;
            break;
          }
          case 'inactive': {
            this.inactiveStatus = true;
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
      ...this.parseCampaigns()
    ];

    return {
      start: this.date.start.clone(),
      end: this.date.end.clone(),
      filters: filters
    }
  }

  parseCampaigns(): {facet: string, values: string[]}[] {
    if (!this.selectedCampaigns || this.selectedCampaigns.length === 0) return [];

    const campaignFacet = {
      facet: 'campaignName',
      values: this.selectedCampaigns.filter(c => c.name).map(c => c.name)
    };

    if (campaignFacet.values.length === 0) return [];

    return [campaignFacet];
  }

  private parseStatusFilters(): {facet: string, values: string[]}[] {
    if (!this.allStatus) {

      const statusFacet = {facet: 'status', values: []};

      if (this.activeStatus) {
        statusFacet.values.push('active');
      }
      if (this.inactiveStatus) {
        statusFacet.values.push('inactive');
      }

      if (this.cancelledStatus) {
        statusFacet.values.push('canceled');
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
      this.inactiveStatus = false;
      this.cancelledStatus = false;
    }
  }

  singleStatusSelected(event) {
    if (event.checked) {
      this.allStatus = false;
    }
  }

  addCampaign() {
    this.selectedCampaigns = [...this.selectedCampaigns, new Campaign()];
  }

  removeCampaignAtIndex(index) {
    this.selectedCampaigns.splice(index, 1);
  }

}
