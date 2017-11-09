import {RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {RegistrationComponent} from './registration/registration.component';
import {RegisterGuard} from './register-guard.service';
import {InviteAcceptComponent} from './invite-accept/invite-accept.component';
import {TermsAndConditionsComponent} from './terms-and-conditions/terms-and-conditions.component';
import {AuthGuard} from './auth-guard.service';

export const routing = RouterModule.forChild([
  { path: '', component: AuthComponent},
  { path: 'register', component: RegistrationComponent, canActivate: [RegisterGuard]},
  { path: 'acceptinvite', component: InviteAcceptComponent},
  { path: 'terms-and-conditions', component: TermsAndConditionsComponent, canActivate: [AuthGuard]}
]);
