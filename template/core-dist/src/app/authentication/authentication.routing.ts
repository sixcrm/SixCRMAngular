import {RouterModule} from '@angular/router';
import {AuthComponent} from './auth/auth.component';

export const routing = RouterModule.forChild([
  { path: '', component: AuthComponent}
]);
