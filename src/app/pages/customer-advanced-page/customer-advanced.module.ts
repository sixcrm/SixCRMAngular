import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAdvancedComponent } from './customer-advanced.component';
import {customerAdvancedRouting} from './customer-advanced.routing';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerInfoNotesComponent } from './customer-info-notes/customer-info-notes.component';
import {FormsModule} from '@angular/forms';
import { CustomerAdvancedTransactionsComponent } from './customer-advanced-transactions/customer-advanced-transactions.component';
import { CustomerAdvancedRebillsComponent } from './customer-advanced-rebills/customer-advanced-rebills.component';
import { CustomerAdvancedFulfillmentComponent } from './customer-advanced-fulfillment/customer-advanced-fulfillment.component';
import { CustomerAdvancedEventsComponent } from './customer-advanced-events/customer-advanced-events.component';
import { RebillItemComponent } from './rebill-item/rebill-item.component';
import { CustomerAdvancedSubscriptionsComponent } from './customer-advanced-subscriptions/customer-advanced-subscriptions.component';

@NgModule({
  imports: [
    CommonModule,
    customerAdvancedRouting,
    PageComponentsModule,
    SharedModule,
    MaterialSelectionModule,
    FormsModule
  ],
  declarations: [
    CustomerAdvancedComponent,
    CustomerInfoComponent,
    CustomerInfoNotesComponent,
    CustomerAdvancedTransactionsComponent,
    CustomerAdvancedRebillsComponent,
    CustomerAdvancedFulfillmentComponent,
    CustomerAdvancedEventsComponent,
    RebillItemComponent,
    CustomerAdvancedSubscriptionsComponent
  ]
})
export class CustomerAdvancedModule { }
