import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {CustomersComponent} from './customers.component';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';
import {CustomerViewComponent} from './customer-view/customer-view.component';

export const customersRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : CustomersComponent, canActivate: [CustomersAclGuard] },
      { path : ':id', component : CustomerViewComponent, canActivate: [CustomersAclGuard] },
    ]
  }
]);

