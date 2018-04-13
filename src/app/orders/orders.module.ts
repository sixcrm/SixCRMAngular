import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrderComponent } from './create-order/create-order.component';
import {SharedModule} from '../shared/shared.module';
import { CreateOrderSummaryComponent } from './create-order/create-order-summary/create-order-summary.component';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MaterialSelectionModule
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
