import {RouterModule} from '@angular/router';
import {FulfillmentProvidersComponent} from './fulfillment-providers-index/fulfillment-providers.component';
import {FulfillmentProvidersAclGuard} from '../guards/fulfillment-providers-acl-guard.service';
import {FulfillmentProviderViewComponent} from './fulfillment-provider-view/fulfillment-provider-view.component';

export const fulfillmentProvidersRouting = RouterModule.forChild([
  { path : '', component : FulfillmentProvidersComponent, canActivate: [FulfillmentProvidersAclGuard] },
  { path : ':id', component : FulfillmentProviderViewComponent, canActivate: [FulfillmentProvidersAclGuard] }
]);

