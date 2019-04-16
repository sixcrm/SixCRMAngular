import {RouterModule} from '@angular/router';
import {SessionsComponent} from './sessions-index/sessions.component';
import {SessionsAclGuard} from '../guards/sessions-acl-guard.service';

export const sessionsRouting = RouterModule.forChild([
  { path : '', component : SessionsComponent, canActivate: [SessionsAclGuard] }
]);

