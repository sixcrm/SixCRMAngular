import {RouterModule} from '@angular/router';
import {FeaturesComponent} from './features-index/features.component';
import {FeaturesAclGuard} from '../guards/features-acl-guard.service';

export const featuresRouting = RouterModule.forChild([
  { path : '', component : FeaturesComponent, canActivate: [FeaturesAclGuard] }
]);
