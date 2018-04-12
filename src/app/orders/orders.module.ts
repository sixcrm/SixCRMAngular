import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrderComponent } from './create-order/create-order.component';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '@angular/material';
import { CreateOrderSummaryComponent } from './create-order/create-order-summary/create-order-summary.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [
    CreateOrderComponent,
    CreateOrderSummaryComponent
  ],
  exports: [
    CreateOrderComponent
  ]
})
export class OrdersModule { }
