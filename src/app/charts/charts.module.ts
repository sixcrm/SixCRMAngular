import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {TransactionSummaryChartComponent} from './transaction-summary/transaction-summary.component';
import {ChartModule} from 'angular2-highcharts';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MerchantReportChartComponent} from './merchant-report-chart/merchant-report-chart.component';
import {TranslationModule} from '../translation/translation.module';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {EntityServicesModule} from '../entity-services/entity-services.module';

export function hchartFactory() {
  return require('highcharts/highstock');
}

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    SharedModule,
    EntityServicesModule,
    MaterialSelectionModule,
    RouterModule,
    TranslationModule
  ],
  declarations: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent
  ],
  exports: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: hchartFactory
    }
  ]
})
export class ChartsModule { }
