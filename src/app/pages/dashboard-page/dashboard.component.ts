import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {Campaign} from '../../shared/models/campaign.model';
import {DashboardQuery, DashboardTimeFilter} from './dashboard.exports';
import {CampaignsService} from '../../shared/services/campaigns.service';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Currency} from '../../shared/utils/currency/currency';
import {AuthenticationService} from '../../authentication/authentication.service';

@Component({
  selector: 'c-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  campaigns: Campaign[] = [new Campaign({name: 'All Campaigns'})];
  selectedCampaign: Campaign = this.campaigns[0];

  queries: DashboardQuery[] = [
    {label: 'Revenue vs Orders', selected: true},
    {label: 'Orders vs Upsells', selected: false},
    {label: 'Direct $ vs Rebill $', selected: false},
    {label: 'Average $ per Order', selected: false}
  ];
  selectedQuery: DashboardQuery = this.queries[0];

  timeFilters: DashboardTimeFilter[] = [
    {label: 'Lifetime', selected: true},
    {label: 'Past 30 Days', selected: false}
  ];

  totalAmount: Currency = new Currency(12015.25);
  name: string;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(private authService: AuthenticationService, private campaignService: CampaignsService) { }

  ngOnInit() {
    this.authService.sixUser$.takeUntil(this.unsubscribe$).subscribe(user => {
      this.name = user.firstName;
    });

    this.campaignService.entities$.take(1).takeUntil(this.unsubscribe$).subscribe(campaigns => {
      if (campaigns instanceof CustomServerError) return;

      this.campaigns = [...this.campaigns, ...campaigns];
    });

    this.campaignService.getEntities(null, null, {ignoreProgress: true});
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  selectCampaign(campaign: Campaign) {
    this.selectedCampaign = campaign;
  }

  selectQuery(query: DashboardQuery) {
    this.selectedQuery.selected = false;

    this.selectedQuery = query;
    this.selectedQuery.selected = true;
  }

  selectTimeFilter(filter: DashboardTimeFilter) {
    this.timeFilters.forEach(f => f.selected = (f === filter));
  }
}
