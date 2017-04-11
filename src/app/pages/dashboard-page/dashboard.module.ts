import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {dashboardRouting} from './dashboard.routing';
import {MaterialModule} from '@angular/material';
import {DashboardComponent} from './dashboard.component';
import {ChartsModule} from 'ng2-charts';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    dashboardRouting,
    SharedModule,
    CommonModule,
    MaterialModule.forRoot(),
    ChartsModule
  ],
  declarations : [
    DashboardComponent
  ],
  exports : [
  ],
  providers: [
  ]
})
export class DashboardModule {
}
