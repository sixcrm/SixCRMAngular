import {RouterModule} from '@angular/router';
import {AffiliatesComponent} from './affiliates.component';
import {AffiliatesAclGuard} from '../guards/affiliates-acl-guard.service';
import {AffiliateViewComponent} from './affiliate-view/affiliate-view.component';

export const affiliatesRouting = RouterModule.forChild([
  { path : '', component : AffiliatesComponent, canActivate: [AffiliatesAclGuard] },
  { path : ':id', component : AffiliateViewComponent, canActivate: [AffiliatesAclGuard] }
]);

