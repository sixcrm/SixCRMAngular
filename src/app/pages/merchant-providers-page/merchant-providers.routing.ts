import {RouterModule} from '@angular/router';
import {MerchantProvidersComponent} from './merchant-providers.component';
import {MerchantProvidersAclGuard} from '../guards/merchant-providers-acl-guard.service';
import {MerchantProviderViewComponent} from './merchant-provider-view/merchant-provider-view.component';

export const merchantProvidersRouting = RouterModule.forChild([
  { path : '', component : MerchantProvidersComponent, canActivate: [MerchantProvidersAclGuard] },
  { path : ':id', component : MerchantProviderViewComponent, canActivate: [MerchantProvidersAclGuard] }
]);

