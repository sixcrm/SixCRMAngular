import {RouterModule} from '@angular/router';
import {PaymentComponent} from './payment/payment.component';
import {PaymentGuard} from './payment-guard.service';
import {PaymentInfoComponent} from './payment-info/payment-info.component';
import {PaymentInfoGuard} from './payment-info-guard.service';

export const paymentRouting = RouterModule.forChild([
  { path: '', component: PaymentComponent, canActivate: [PaymentGuard] },
  { path: 'info', component: PaymentInfoComponent, canActivate: [PaymentInfoGuard] }
]);
