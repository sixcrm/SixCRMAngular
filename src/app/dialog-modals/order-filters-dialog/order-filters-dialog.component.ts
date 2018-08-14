import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog, FilterDialogResponse} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {Moment} from 'moment';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';
import {Campaign} from '../../shared/models/campaign.model';
import {CampaignStats} from '../../shared/models/campaign-stats.model';
import {CampaignsService} from '../../entity-services/services/campaigns.service';
import {campaignsNamesListQuery} from '../../shared/utils/queries/entities/campaign.queries';

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

  selectedCampaigns: Campaign[] = [new Campaign()];

  campaignMapper = (campaign) => campaign ? campaign.name : '';

  constructor(dialogRef: MatDialogRef<OrderFiltersDialogComponent>, public campaignsService: CampaignsService) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'amount', label: 'Sale Amount' },
      { name: 'customerName', label: 'Customer Name' }
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

  addCampaign() {
    this.selectedCampaigns = [...this.selectedCampaigns, new Campaign()];
  }

  removeCampaignAtIndex(index) {
    this.selectedCampaigns.splice(index, 1);
  }

}
