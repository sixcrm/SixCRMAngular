import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {AuthComponent} from './auth/auth.component';
import {routing} from './authentication.routing';
import {AuthGuard} from './auth-guard.service';
import { RegistrationComponent } from './registration/registration.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RegisterGuard} from './register-guard.service';
import { InviteAcceptComponent } from './invite-accept/invite-accept.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import {TermsAndConditionsGuard} from './terms-and-conditions-guard.service';
import {SharedModule} from '../shared/shared.module';
import {TranslationModule} from '../translation/translation.module';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import { PlansComponent } from './registration/plans/plans.component';
import { PaymentComponent } from './registration/payment/payment.component';

@NgModule({
  imports : [
    routing,
    RouterModule,
    MaterialSelectionModule,
    CommonModule,
    FormsModule,
    SharedModule,
    TranslationModule
  ],
  declarations : [
    AuthComponent,
    RegistrationComponent,
    InviteAcceptComponent,
    TermsAndConditionsComponent,
    PlansComponent,
    PaymentComponent
  ],
  exports: [
    TermsAndConditionsComponent
  ],
  providers : [
    AuthenticationService,
    AuthGuard,
    TermsAndConditionsGuard,
    RegisterGuard
  ]
})
export class AuthenticationModule { }
