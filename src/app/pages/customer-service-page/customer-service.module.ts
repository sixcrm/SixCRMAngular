import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {FormsModule} from '@angular/forms';
import { CustomerServiceCustomerComponent } from './customer-service-customer/customer-service-customer.component';
import { CustomerServiceOrderComponent } from './customer-service-order/customer-service-order.component';
import { CustomerServicePairComponent } from './customer-service-pair/customer-service-pair.component';
import {customerServiceRouting} from './customer-service.routing';
import {CustomerServiceDashboardComponent} from './customer-service-dashboard/customer-service-dashboard.component';
import { GridNotesComponentComponent } from './customer-service-customer/grid-notes-component/grid-notes-component.component';
import { EventsTableComponent } from './customer-service-customer/events-table/events-table.component';
import {TranslationModule} from '../../translation/translation.module';
import {SharedModule} from '../../shared/shared.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { CustomerServiceSessionsComponent } from './customer-service-order/customer-service-sessions/customer-service-sessions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    customerServiceRouting,
    TranslationModule,
    SharedModule,
    InfiniteScrollModule
  ],
  declarations: [
    CustomerServiceDashboardComponent,
    CustomerServiceCustomerComponent,
    CustomerServiceOrderComponent,
    CustomerServicePairComponent,
    GridNotesComponentComponent,
    EventsTableComponent,
    CustomerServiceSessionsComponent
  ]
})
export class CustomerServiceModule { }
