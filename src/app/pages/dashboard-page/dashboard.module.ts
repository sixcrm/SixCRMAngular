import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {dashboardRouting} from './dashboard.routing';
import {MaterialModule} from '@angular/material';
import {DashboardComponent} from './dashboard.component';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {Daterangepicker} from 'ng2-daterangepicker';

export function highchartsFactory() {
  return require('highcharts/highstock');
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
    DashboardComponent
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
