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

@NgModule({
  imports : [
    customersRouting,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    CustomersComponent,
    CustomerViewComponent,
    CustomerComponent,
    CustomerTransactionsComponent,
    CustomerSessionsComponent
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
