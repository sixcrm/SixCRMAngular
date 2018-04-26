import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {FormsModule} from '@angular/forms';
import { CustomerServiceCustomerComponent } from './customer-service-customer/customer-service-customer.component';
import { CustomerServiceOrderComponent } from './customer-service-order/customer-service-order.component';
import { CustomerServicePairComponent } from './customer-service-pair/customer-service-pair.component';
import {customerServiceRouting} from './customer-service.routing';
import {CustomerServiceDashboardComponent} from './customer-service-dashboard/customer-service-dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    customerServiceRouting
  ],
  declarations: [
    CustomerServiceDashboardComponent,
    CustomerServiceCustomerComponent,
    CustomerServiceOrderComponent,
    CustomerServicePairComponent
  ]
})
export class CustomerServiceModule { }
