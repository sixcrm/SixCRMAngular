import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {AuthComponent} from './auth/auth.component';
import {routing} from './authentication.routing';
import {AUTH_PROVIDERS} from 'angular2-jwt';
import {AuthGuard} from './auth-guard.service';

@NgModule({
  imports : [routing, RouterModule],
  declarations : [
    AuthComponent
  ],
  providers : [
    AuthenticationService,
    AuthGuard,
    AUTH_PROVIDERS,
  ]
})
export class AuthenticationModule { }
