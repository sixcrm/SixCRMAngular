import {RouterModule} from '@angular/router';
import {RebillsAclGuard} from '../guards/rebills-acl-guard.service';
import {RebillsComponent} from './rebills.component';
import {RebillViewComponent} from './rebill-view/rebill-view.component';

export const rebillsRouting = RouterModule.forChild([
  { path : '', component : RebillsComponent, canActivate: [RebillsAclGuard] },
  { path : ':id', component : RebillViewComponent, canActivate: [RebillsAclGuard] }
]);

