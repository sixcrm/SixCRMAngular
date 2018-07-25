import { Component, OnInit } from '@angular/core';
import {AbstractFilterDialog} from '../abstract-filter-dialog';
import {MatDialogRef} from '@angular/material';
import {ValueFilterOperator} from '../../shared/components/value-filter/value-filter.component';
import {Campaign} from '../../shared/models/campaign.model';

@Component({
  selector: 'subscription-filters-dialog',
  templateUrl: './subscription-filters-dialog.component.html',
  styleUrls: ['./subscription-filters-dialog.component.scss']
})
export class SubscriptionFiltersDialogComponent extends AbstractFilterDialog<SubscriptionFiltersDialogComponent> implements OnInit {

  allCampaigns: Campaign[] = [new Campaign({name: 'ABC'}), new Campaign({name: 'DEF'})];
  selectedCampaigns: Campaign[] = [new Campaign()];

  campaignMapper = (campaign) => campaign ? campaign.name : '';

  constructor(dialogRef: MatDialogRef<SubscriptionFiltersDialogComponent>) {
    super(dialogRef);

    this.filterColumns = [
      { name: 'cycle', label: 'Cycle' },
      { name: 'amount', label: 'Amount' },
      { name: 'campaign', label: 'Campaign' }
    ];

    this.filters = [{column: this.filterColumns[0], operator: ValueFilterOperator.GREATER, value: ''}];
  }

  ngOnInit() {
  }

  addCampaign() {
    this.selectedCampaigns = [...this.selectedCampaigns, new Campaign()];
  }

  removeCampaignAtIndex(index) {
    this.selectedCampaigns.splice(index, 1);
  }
}
