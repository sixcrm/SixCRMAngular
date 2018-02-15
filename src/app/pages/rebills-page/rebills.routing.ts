import {RouterModule} from '@angular/router';
import {RebillsAclGuard} from '../guards/rebills-acl-guard.service';
import {RebillsComponent} from './rebills-index/rebills.component';
import {RebillViewComponent} from './rebill-view/rebill-view.component';
import {RebillsPendingComponent} from "./rebills-pending-index/rebills-pending.component";

export const rebillsRouting = RouterModule.forChild([
  { path : '', component : RebillsComponent, canActivate: [RebillsAclGuard] },
  { path : 'pending', component : RebillsPendingComponent, canActivate: [RebillsAclGuard] },
  { path : ':id', component : RebillViewComponent, canActivate: [RebillsAclGuard] }
]);

