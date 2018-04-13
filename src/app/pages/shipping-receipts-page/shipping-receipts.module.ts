import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from '../../translation/translation.module';
import {shippingReceiptRouting} from './shipping-receipts.routing';
import {ShippingReceiptViewComponent} from './shipping-receipts-view/shipping-receipt-view.component';
import {ShippingReceiptsComponent} from './shipping-receipts-index/shipping-receipts.component';
import {ClipboardModule} from 'ngx-clipboard';
import {ShippingReceiptsAclGuard} from '../guards/shipping-receipts-acl-guard.service';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports : [
    shippingReceiptRouting,
    CommonModule,
    FormsModule,
    PageComponentsModule,
    MaterialSelectionModule,
    SharedModule,
    TranslationModule,
    ClipboardModule
  ],
  declarations : [
    ShippingReceiptViewComponent,
    ShippingReceiptsComponent
  ],
  exports : [ ],
  providers: [ShippingReceiptsAclGuard]
})
export class ShippingReceiptsModule { }
