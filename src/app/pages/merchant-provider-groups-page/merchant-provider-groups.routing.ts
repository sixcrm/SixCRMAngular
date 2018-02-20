import {RouterModule} from '@angular/router';
import {MerchantProviderGroupViewComponent} from './merchant-provider-group-view/merchant-provider-group-view.component';
import {MerchantProviderGroupsAclGuard} from '../guards/merchant-provider-group-acl-guard.service';
import {MerchantProviderGroupsComponent} from './merchant-provider-groups-index/merchant-provider-groups.component';

export const merchantProviderGroupsRouting = RouterModule.forChild([
  { path : '', component : MerchantProviderGroupsComponent, canActivate: [MerchantProviderGroupsAclGuard] },
  { path : ':id', component : MerchantProviderGroupViewComponent, canActivate: [MerchantProviderGroupsAclGuard], canDeactivate: [MerchantProviderGroupsAclGuard] }
]);

