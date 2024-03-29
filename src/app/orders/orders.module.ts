import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateOrderComponent } from './create-order/create-order.component';
import {SharedModule} from '../shared/shared.module';
import { CreateOrderSummaryComponent } from './create-order/create-order-summary/create-order-summary.component';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TextMaskModule} from 'angular2-text-mask';
import { CreateOrderPreviewComponent } from './create-order/create-order-preview/create-order-preview.component';
import { CreateOrderSuccessComponent } from './create-order/create-order-success/create-order-success.component';
import {EntityServicesModule} from '../entity-services/entity-services.module';
import {ClipboardModule} from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EntityServicesModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialSelectionModule,
    TextMaskModule,
    ClipboardModule
  ],
  declarations: [
    CreateOrderComponent,
    CreateOrderSummaryComponent,
    CreateOrderPreviewComponent,
    CreateOrderSuccessComponent
  ],
  exports: [
    CreateOrderComponent
  ]
})
export class OrdersModule { }
