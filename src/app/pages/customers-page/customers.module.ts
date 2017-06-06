import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {customersRouting } from './customers.routing';
import {MaterialModule} from '@angular/material';
import {CustomersComponent} from './customers.component';
import {CustomerViewComponent} from './customer-view/customer-view.component';
import {CustomerComponent} from './customer/customer.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';
import { CustomerTransactionsComponent } from './customer-view/customer-transactions/customer-transactions.component';
import { CustomerSessionsComponent } from './customer-view/customer-sessions/customer-sessions.component';
import {SharedModule} from '../../shared/shared.module';
import { CustomerRebillsComponent } from './customer-view/customer-rebills/customer-rebills.component';
import { CustomerNotesComponent } from './customer-view/customer-notes/customer-notes.component';
import { CustomerEventsComponent } from './customer-view/customer-events/customer-events.component';

@NgModule({
  imports : [
    customersRouting,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    CustomersComponent,
    CustomerViewComponent,
    CustomerComponent,
    CustomerTransactionsComponent,
    CustomerSessionsComponent,
    CustomerRebillsComponent,
    CustomerNotesComponent,
    CustomerEventsComponent
  ],
  exports : [
    CustomerComponent
  ],
  providers: [
    CustomersAclGuard
  ]
})
export class CustomersModule {
}
