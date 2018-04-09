import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {dashboardRouting} from './dashboard.routing';
import {MaterialModule} from '@angular/material';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {Daterangepicker} from 'ng2-daterangepicker';
import { FunnelGraphComponent } from './funnel-graph/funnel-graph.component';
import { DashboardReportsComponent } from './dashboard-reports/dashboard-reports.component';
import { MoversCardComponent } from './movers-card/movers-card.component';
import { EventsSummaryComponent } from './events-summary/events-summary.component';
import { TopCampaignsComponent } from './top-campaigns/top-campaigns.component';
import { TransactionOverviewCardComponent } from './transaction-overview/transaction-overview-card/transaction-overview-card.component';
import { TransactionOverviewComponent } from './transaction-overview/transaction-overview.component';
import {TransactionByComponent} from './transaction-by/transaction-by.component';
import {EventsByComponent} from './events-by/events-by.component';
import {ChartsModule} from '../../charts/charts.module';
import {TranslationModule} from "../../translation/translation.module";
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardHeaderDropdownComponent } from './dashboard-header/dashboard-header-dropdown/dashboard-header-dropdown.component';
import { DashboardDualGraphComponent } from './dashboard-dual-graph/dashboard-dual-graph.component';
import { DashboardIssuesReportComponent } from './dashboard-issues-report/dashboard-issues-report.component';
import { TopSubscriptionsComponent } from './top-subscriptions/top-subscriptions.component';

export function highchartsFactory() {
  let hc = require('highcharts');
  let hcm = require('highcharts/highcharts-more');
  let sg = require('highcharts/modules/solid-gauge');

  hcm(hc);
  sg(hc);

  return hc;
}

@NgModule({
  imports : [
    dashboardRouting,
    SharedModule,
    CommonModule,
    MaterialModule.forRoot(),
    ChartModule,
    Daterangepicker,
    ChartsModule,
    TranslationModule
  ],
  declarations : [
    DashboardComponent,
    TransactionOverviewCardComponent,
    FunnelGraphComponent,
    DashboardReportsComponent,
    MoversCardComponent,
    EventsByComponent,
    EventsSummaryComponent,
    TopCampaignsComponent,
    TransactionOverviewComponent,
    TransactionByComponent,
    DashboardHeaderComponent,
    DashboardHeaderDropdownComponent,
    DashboardDualGraphComponent,
    DashboardIssuesReportComponent,
    TopSubscriptionsComponent
  ],
  exports : [ ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
})
export class DashboardModule {
}
