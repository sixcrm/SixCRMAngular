import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {dashboardRouting} from './dashboard.routing';
import {MaterialModule} from '@angular/material';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {Daterangepicker} from 'ng2-daterangepicker';
import { TransactionOverviewComponent } from './transaction-overview/transaction-overview.component';
import { InputAutocompleteComponent } from './input-autocomplete/input-autocomplete.component';
import { FunnelGraphComponent } from './funnel-graph/funnel-graph.component';
import { DashboardReportsComponent } from './dashboard-reports/dashboard-reports.component';

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
    Daterangepicker
  ],
  declarations : [
    DashboardComponent,
    TransactionOverviewComponent,
    InputAutocompleteComponent,
    FunnelGraphComponent,
    DashboardReportsComponent
  ],
  exports : [
  ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
})
export class DashboardModule {
}
