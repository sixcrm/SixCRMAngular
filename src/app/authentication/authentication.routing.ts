import {RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {RegistrationComponent} from './registration/registration.component';
import {RegisterGuard} from './register-guard.service';
import {InviteAcceptComponent} from './invite-accept/invite-accept.component';
import {AccountInfoComponent} from './account-info/account-info.component';
import {AccountInfoGuard} from './account-info-guard.service';

export const routing = RouterModule.forChild([
  { path: '', component: AuthComponent},
  { path: 'signup', component: AuthComponent},
  { path: 'register', component: RegistrationComponent, canActivate: [RegisterGuard]},
  { path: 'account-info', component: AccountInfoComponent, canActivate: [AccountInfoGuard]},
  { path: 'acceptinvite/:hash', component: InviteAcceptComponent}
]);
