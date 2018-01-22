import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from '../../translation/translation.module';
import {shippingReceiptRouting} from './shipping-receipts.routing';
import {ShippingReceiptViewComponent} from './shipping-receipts-view/shipping-receipt-view.component';
import {ShippingReceiptsComponent} from './shipping-receipts-index/shipping-receipts.component';
import {ClipboardModule} from 'ngx-clipboard';
import {ShippingReceiptsAclGuard} from '../guards/shipping-receipts-acl-guard.service';

@NgModule({
  imports : [
    shippingReceiptRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
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
