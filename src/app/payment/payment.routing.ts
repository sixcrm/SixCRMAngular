import {RouterModule} from '@angular/router';
import {PaymentComponent} from './payment/payment.component';
import {PaymentGuard} from './payment-guard.service';

export const paymentRouting = RouterModule.forChild([
  { path: '', component: PaymentComponent, canActivate: [PaymentGuard] }
]);
