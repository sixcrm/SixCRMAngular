import {RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';
import {RegistrationComponent} from './registration/registration.component';

export const routing = RouterModule.forChild([
  { path: '', component: AuthComponent},
  { path: 'register', component: RegistrationComponent}
]);
