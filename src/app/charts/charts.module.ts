import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {TransactionSummaryChartComponent} from './transaction-summary/transaction-summary.component';
import {ChartModule} from 'angular2-highcharts';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {MerchantReportChartComponent} from './merchant-report-chart/merchant-report-chart.component';
import { StateMachineDetailsChartComponent } from './state-machine-details-chart/state-machine-details-chart.component';
import {TranslationModule} from '../translation/translation.module';
import { BillingChartComponent } from './billing-chart/billing-chart.component';

export function hchartFactory() {
  return require('highcharts');
}

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    TranslationModule
  ],
  declarations: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent,
    StateMachineDetailsChartComponent,
    BillingChartComponent
  ],
  exports: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent,
    StateMachineDetailsChartComponent,
    BillingChartComponent
  ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: hchartFactory
  }]
})
export class ChartsModule { }
