import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {LoginComponent} from './login/login.component';
import {routing} from './authentication.routing';
import {SharedModule} from '../shared/shared.module';
import {RegisterComponent} from './register/register.component';
import {MaterialModule} from '@angular/material';
import {AUTH_PROVIDERS} from 'angular2-jwt';

@NgModule({
  imports : [routing, RouterModule, FormsModule, CommonModule, SharedModule, MaterialModule],
  declarations : [
    LoginComponent, RegisterComponent
  ],
  providers : [
    AuthenticationService,
    AUTH_PROVIDERS,
  ]
})
export class AuthenticationModule {
  constructor() {
    console.log('loaded auth module');
  }
}
