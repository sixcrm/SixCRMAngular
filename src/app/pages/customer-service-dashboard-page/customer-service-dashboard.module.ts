import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { customerServiceDashboardRouting } from './customer-service-dashboard.routing';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    customerServiceDashboardRouting
  ],
  declarations: [
    CustomerServiceComponent
  ]
})
export class CustomerServiceDashboardModule { }
