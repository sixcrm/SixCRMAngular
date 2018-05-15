import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {dashboardRouting} from './dashboard.routing';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {Daterangepicker} from 'ng2-daterangepicker';
import { FunnelGraphComponent } from './funnel-graph/funnel-graph.component';
import { TopCampaignsComponent } from './top-campaigns/top-campaigns.component';
import {ChartsModule} from '../../charts/charts.module';
import {TranslationModule} from "../../translation/translation.module";
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardHeaderDropdownComponent } from './dashboard-header/dashboard-header-dropdown/dashboard-header-dropdown.component';
import { DashboardDualGraphComponent } from './dashboard-dual-graph/dashboard-dual-graph.component';
import { DashboardIssuesReportComponent } from './dashboard-issues-report/dashboard-issues-report.component';
import { TopSubscriptionsComponent } from './top-subscriptions/top-subscriptions.component';
import { MaterialSelectionModule } from '../../material-selection/material-selection.module';
import {DashboardSetupComponent} from './states/setup/dashboard-setup.component'
import {DashboardFullComponent} from './states/full/dashboard-full.component'

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
    MaterialSelectionModule,
    ChartModule,
    Daterangepicker,
    ChartsModule,
    TranslationModule
  ],
  declarations : [
    DashboardComponent,
    FunnelGraphComponent,
    TopCampaignsComponent,
    DashboardHeaderComponent,
    DashboardHeaderDropdownComponent,
    DashboardDualGraphComponent,
    DashboardIssuesReportComponent,
    TopSubscriptionsComponent,
    DashboardSetupComponent,
    DashboardFullComponent
  ],
  exports : [ ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
})
export class DashboardModule {
}
