import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {FulfillmentProvidersComponent} from './fulfillment-providers.component';
import {FulfillmentProvidersAclGuard} from '../guards/fulfillment-providers-acl-guard.service';
import {FulfillmentViewComponent} from './fulfillment-view/fulfillment-view.component';

export const fulfillmentProvidersRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : FulfillmentProvidersComponent, canActivate: [FulfillmentProvidersAclGuard] },
      { path : ':id', component : FulfillmentViewComponent, canActivate: [FulfillmentProvidersAclGuard] },
    ]
  }
]);

