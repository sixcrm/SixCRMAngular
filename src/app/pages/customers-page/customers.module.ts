import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {customersRouting } from './customers.routing';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {CustomersComponent} from './customers.component';
import {CustomerViewComponent} from './customer-view/customer-view.component';
import {CustomerComponent} from './customer/customer.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';

@NgModule({
  imports : [
    customersRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    CustomersComponent,
    CustomerViewComponent,
    CustomerComponent
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
