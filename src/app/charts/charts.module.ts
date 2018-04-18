import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {TransactionSummaryChartComponent} from './transaction-summary/transaction-summary.component';
import {ChartModule} from 'angular2-highcharts';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MerchantReportChartComponent} from './merchant-report-chart/merchant-report-chart.component';
import { StateMachineDetailsChartComponent } from './state-machine-details-chart/state-machine-details-chart.component';
import {TranslationModule} from '../translation/translation.module';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';

export function hchartFactory() {
  return require('highcharts');
}

@NgModule({
  imports: [
    CommonModule,
    ChartModule,
    SharedModule,
    MaterialSelectionModule,
    RouterModule,
    TranslationModule
  ],
  declarations: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent,
    StateMachineDetailsChartComponent
  ],
  exports: [
    TransactionSummaryChartComponent,
    MerchantReportChartComponent,
    StateMachineDetailsChartComponent
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: hchartFactory
    }
  ]
})
export class ChartsModule { }
