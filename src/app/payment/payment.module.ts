import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {paymentRouting} from './payment.routing';
import {PaymentGuard} from './payment-guard.service';
import {PlansComponent} from './plans/plans.component';
import {PlanPaymentComponent} from './plan-payment/plan-payment.component';
import {FormsModule} from '@angular/forms';
import {TranslationModule} from '../translation/translation.module';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import {PaymentInfoGuard} from './payment-info-guard.service';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialSelectionModule,
    FormsModule,
    TranslationModule,
    paymentRouting,
    SharedModule
  ],
  declarations: [
    PaymentComponent,
    PlansComponent,
    PlanPaymentComponent,
    PaymentInfoComponent
  ],
  providers: [PaymentGuard, PaymentInfoGuard]
})
export class PaymentModule { }
