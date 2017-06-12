import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {AuthComponent} from './auth/auth.component';
import {routing} from './authentication.routing';
import {AuthGuard} from './auth-guard.service';
import { RegistrationComponent } from './registration/registration.component';
import {MaterialModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RegisterGuard} from './register-guard.service';
import { InviteAcceptComponent } from './invite-accept/invite-accept.component';

@NgModule({
  imports : [
    routing,
    RouterModule,
    MaterialModule.forRoot(),
    CommonModule,
    FormsModule
  ],
  declarations : [
    AuthComponent,
    RegistrationComponent,
    InviteAcceptComponent
  ],
  providers : [
    AuthenticationService,
    AuthGuard,
    RegisterGuard
  ]
})
export class AuthenticationModule { }
