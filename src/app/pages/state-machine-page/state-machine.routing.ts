import {RouterModule} from '@angular/router';
import {StateMachineDashboardComponent} from './state-machine-dashboard/state-machine-dashboard.component';
import {StateMachineAclGuard} from '../guards/state-machine-acl-guard.service';

export const stateMachineRouting = RouterModule.forChild([
  { path : '', component : StateMachineDashboardComponent, canActivate: [StateMachineAclGuard] }
]);

