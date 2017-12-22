import {RouterModule} from '@angular/router';
import {ShippingReceiptsComponent} from './shipping-receipts-index/shipping-receipts.component';
import {ShippingReceiptViewComponent} from './shipping-receipts-view/shipping-receipt-view.component';
import {ShippingReceiptsAclGuard} from '../guards/shipping-receipts-acl-guard.service';

export const shippingReceiptRouting = RouterModule.forChild([
  { path : '', component : ShippingReceiptsComponent, canActivate: [ShippingReceiptsAclGuard] },
  { path : ':id', component : ShippingReceiptViewComponent, canActivate: [ShippingReceiptsAclGuard] }
]);

