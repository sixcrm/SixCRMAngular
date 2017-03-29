import {RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {RegistrationComponent} from './registration/registration.component';
import {LoginGuard} from './login-guard.service';
import {InviteAcceptComponent} from './invite-accept/invite-accept.component';

export const routing = RouterModule.forChild([
  { path: '', component: AuthComponent},
  { path: 'register', component: RegistrationComponent, canActivate: [LoginGuard]},
  { path: 'acceptinvite', component: InviteAcceptComponent}
]);
