import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {paymentRouting} from './payment.routing';
import {PaymentGuard} from './payment-guard.service';
import {PlansComponent} from './plans/plans.component';
import {PlanBillingComponent} from './plan-billing/plan-billing.component';
import {FormsModule} from '@angular/forms';
import {TranslationModule} from '../translation/translation.module';
import {SharedModule} from '../shared/shared.module';
import {EntityServicesModule} from '../entity-services/entity-services.module';
import { PlanPaymentComponent } from './plan-payment/plan-payment.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialSelectionModule,
    FormsModule,
    TranslationModule,
    paymentRouting,
    SharedModule,
    EntityServicesModule
  ],
  declarations: [
    PaymentComponent,
    PlansComponent,
    PlanBillingComponent,
    PlanPaymentComponent,
  ],
  providers: [PaymentGuard]
})
export class PaymentModule { }
