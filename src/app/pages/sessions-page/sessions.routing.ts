import {RouterModule} from '@angular/router';
import {SessionsComponent} from './sessions-index/sessions.component';
import {SessionsAclGuard} from '../guards/sessions-acl-guard.service';
import {SessionViewComponent} from './session-view/session-view.component';

export const sessionsRouting = RouterModule.forChild([
  { path : '', component : SessionsComponent, canActivate: [SessionsAclGuard] },
  { path : ':id', component : SessionViewComponent, canActivate: [SessionsAclGuard] }
]);

