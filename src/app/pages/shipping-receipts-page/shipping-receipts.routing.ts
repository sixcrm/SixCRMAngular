import {RouterModule} from '@angular/router';
import {ShippingReceiptsComponent} from './shipping-receipts-index/shipping-receipts.component';
import {ShippingReceiptViewComponent} from './shipping-receipts-view/shipping-receipt-view.component';

export const shippingReceiptRouting = RouterModule.forChild([
  { path : '', component : ShippingReceiptsComponent },
  { path : ':id', component : ShippingReceiptViewComponent }
]);

