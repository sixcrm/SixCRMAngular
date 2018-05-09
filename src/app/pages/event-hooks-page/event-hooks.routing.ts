import {RouterModule} from '@angular/router';
import {EventHooksComponent} from './event-hook-index/event-hooks.component';
import {EventHookViewComponent} from './event-hook-view/event-hook-view.component';
import {EventHooksAclGuard} from '../guards/event-hooks-acl-guard.service';

export const eventHooksRouting = RouterModule.forChild([
  { path : '', component : EventHooksComponent, canActivate: [EventHooksAclGuard] },
  { path : ':id', component : EventHookViewComponent, canActivate: [EventHooksAclGuard] },
  { path : 'shared/:id', component : EventHookViewComponent, canActivate: [EventHooksAclGuard] }
]);

