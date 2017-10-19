import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {TransactionSummaryChartComponent} from './transaction-summary/transaction-summary.component';
import {ChartModule} from 'angular2-highcharts';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {MerchantReportChartComponent} from './merchant-report-chart/merchant-report-chart.component';

export function hchartFactory() {
  return require('highcharts');
}

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    SharedModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent
  ],
  exports: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent
  ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: hchartFactory
  }]
})
export class ChartsModule { }
