import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {dashboardRouting} from './dashboard.routing';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {DashboardComponent} from './dashboard.component';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  imports : [
    dashboardRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
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
