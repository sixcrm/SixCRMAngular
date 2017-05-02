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
    DashboardComponent,
    TransactionOverviewComponent,
    InputAutocompleteComponent
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
