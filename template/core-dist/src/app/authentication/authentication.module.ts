import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {AuthComponent} from './auth/auth.component';
import {routing} from './authentication.routing';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '@angular/material';
import {AUTH_PROVIDERS} from 'angular2-jwt';

@NgModule({
  imports : [routing, RouterModule, FormsModule, CommonModule, SharedModule, MaterialModule],
  declarations : [
    AuthComponent
  ],
  providers : [
    AuthenticationService,
    AUTH_PROVIDERS,
  ]
})
export class AuthenticationModule { }
