import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {AuthComponent} from './auth/auth.component';
import {routing} from './authentication.routing';
import {AUTH_PROVIDERS} from 'angular2-jwt';
import {AuthGuard} from './auth-guard.service';
import { RegistrationComponent } from './registration/registration.component';
import {MaterialModule} from '@angular/material';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports : [
    routing,
    RouterModule,
    MaterialModule,
    CommonModule,
    FormsModule
  ],
  declarations : [
    AuthComponent,
    RegistrationComponent
  ],
  providers : [
    AuthenticationService,
    AuthGuard,
    AUTH_PROVIDERS,
  ]
})
export class AuthenticationModule { }
