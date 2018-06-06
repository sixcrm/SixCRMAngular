import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAdvancedCustomerComponent } from './customer-advanced-customer/customer-advanced-customer.component';
import {customerAdvancedRouting} from './customer-advanced.routing';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import { CustomerInfoComponent } from './customer-advanced-customer/customer-info/customer-info.component';
import { CustomerInfoNotesComponent } from './customer-advanced-customer/customer-info-notes/customer-info-notes.component';
import {FormsModule} from '@angular/forms';
import { CustomerAdvancedTransactionsComponent } from './customer-advanced-customer/customer-advanced-transactions/customer-advanced-transactions.component';

@NgModule({
  imports: [
    CommonModule,
    customerAdvancedRouting,
    PageComponentsModule,
    SharedModule,
    MaterialSelectionModule,
    FormsModule
  ],
  declarations: [CustomerAdvancedCustomerComponent, CustomerInfoComponent, CustomerInfoNotesComponent, CustomerAdvancedTransactionsComponent]
})
export class CustomerAdvancedModule { }
