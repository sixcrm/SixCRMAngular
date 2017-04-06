import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {MerchantProvidersComponent} from './merchant-providers.component';
import {MerchantProvidersAclGuard} from '../guards/merchant-providers-acl-guard.service';
import {MerchantProviderViewComponent} from './merchant-provider-view/merchant-provider-view.component';

export const merchantProvidersRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : MerchantProvidersComponent, canActivate: [MerchantProvidersAclGuard] },
      { path : ':id', component : MerchantProviderViewComponent, canActivate: [MerchantProvidersAclGuard] },
    ]
  }
]);

