import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAdvancedComponent } from './customer-advanced.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CustomerInfoNotesComponent } from './customer-info-notes/customer-info-notes.component';
import {FormsModule} from '@angular/forms';
import { CustomerAdvancedTransactionsComponent } from './customer-advanced-transactions/customer-advanced-transactions.component';
import { CustomerAdvancedFulfillmentComponent } from './customer-advanced-fulfillment/customer-advanced-fulfillment.component';
import { CustomerAdvancedEventsComponent } from './customer-advanced-events/customer-advanced-events.component';
import { RebillItemComponent } from './rebill-item/rebill-item.component';
import { CustomerAdvancedSubscriptionsComponent } from './customer-advanced-subscriptions/customer-advanced-subscriptions.component';
import { InfoTableComponent } from './item-components/info-table/info-table.component';
import { ProductItemComponent } from './item-components/product-item/product-item.component';
import {EntityServicesModule} from '../../entity-services/entity-services.module';
import {RouterModule} from '@angular/router';
import {CustomerAdvancedOrdersComponent} from './customer-advanced-orders/customer-advanced-orders.component';
import {OrderDetailedComponent} from './order-detailed/order-detailed.component';
import {OrderItemComponent} from './order-item/order-item.component';
import { TransactionsTableComponent } from './item-components/transactions-table/transactions-table.component';
import { ProductsGalleryComponent } from './products-gallery/products-gallery.component';

@NgModule({
  imports: [
    CommonModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    MaterialSelectionModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    CustomerAdvancedComponent,
    CustomerInfoComponent,
    CustomerInfoNotesComponent,
    CustomerAdvancedTransactionsComponent,
    CustomerAdvancedOrdersComponent,
    CustomerAdvancedFulfillmentComponent,
    CustomerAdvancedEventsComponent,
    RebillItemComponent,
    OrderItemComponent,
    CustomerAdvancedSubscriptionsComponent,
    InfoTableComponent,
    ProductItemComponent,
    OrderDetailedComponent,
    TransactionsTableComponent,
    ProductsGalleryComponent
  ],
  exports: [
    CustomerAdvancedComponent
  ]
})
export class CustomerAdvancedModule { }
