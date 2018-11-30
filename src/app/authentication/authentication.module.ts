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
import {SharedModule} from '../shared/shared.module';
import {TranslationModule} from '../translation/translation.module';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import {AccountInfoGuard} from './account-info-guard.service';
import {MarkdownModule} from 'angular2-markdown';
import {MasterAccountGuard} from "./master-account-guard.service";

@NgModule({
  imports : [
    routing,
    RouterModule,
    MaterialSelectionModule,
    CommonModule,
    FormsModule,
    SharedModule,
    TranslationModule,
    MarkdownModule
  ],
  declarations : [
    AuthComponent,
    RegistrationComponent,
    InviteAcceptComponent,
    TermsAndConditionsComponent,
    AccountInfoComponent
  ],
  exports: [
    TermsAndConditionsComponent
  ],
  providers : [
    AuthenticationService,
    AuthGuard,
    RegisterGuard,
    AccountInfoGuard,
    MasterAccountGuard
  ]
})
export class AuthenticationModule { }
