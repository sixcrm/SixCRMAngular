import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {TransactionSummaryChartComponent} from './transaction-summary/transaction-summary.component';
import {ChartModule} from 'angular2-highcharts';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '@angular/material';
import {RouterModule} from '@angular/router';

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
    TransactionSummaryChartComponent
  ],
  exports: [
    TransactionSummaryChartComponent
  ],
  providers: [{
    provide: HighchartsStatic,
    useFactory: hchartFactory
  }]
})
export class ChartsModule { }
