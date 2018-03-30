import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {Campaign} from '../../shared/models/campaign.model';
import {DashboardQuery, DashboardTimeFilter} from './dashboard.exports';
import {CampaignsService} from '../../shared/services/campaigns.service';
import {AsyncSubject} from 'rxjs';
import {CustomServerError} from '../../shared/models/errors/custom-server-error';
import {Currency} from '../../shared/utils/currency/currency';
import {AuthenticationService} from '../../authentication/authentication.service';
import {DashboardIssueReportItem} from './dashboard-issues-report/dashboard-issues-report.component';

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
    {
      label: 'Lifetime',
      selected: true,
      callback: () => {
        this.data = this.dataFirst.slice();
        this.totalAmount = new Currency(52302.25);
        this.revenueMessage = 'Lifetime Total Revenue';
      }
    },
    {
      label: 'Past 30 Days',
      selected: false,
      callback: () => {
        this.data = this.dataSecond.slice();
        this.totalAmount = new Currency(8012.13);
        this.revenueMessage = 'Last 30 Days Revenue';
      }
    }
  ];

  totalAmount: Currency = new Currency(12015.25);
  revenueMessage: string = 'Lifetime Total Revenue';

  name: string;

  dataFirst = [
    [0, 2, 7, 10, 12, 18.7, 26, 28, 30, 31, 36, 52.3],
    [0, 1, 3, 5, 9, 11.2, 20, 21.1, 22, 25, 28, 42]
  ];

  dataSecond = [
    [18.7, 26, 28, 30, 31, 36, 52.3],
    [11.2, 20, 21.1, 22, 25, 28, 42]
  ];

  data = this.dataFirst.slice();

  issueReports: DashboardIssueReportItem[] = [
    {label: 'Orders', issues: []},
    {label: 'Fulfillment', issues: []},
    {label: 'Billing', issues: []},
    {label: 'MIDS', issues: []}
  ];

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

    filter.callback();
  }
}
