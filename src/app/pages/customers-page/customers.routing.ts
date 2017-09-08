import {RouterModule} from '@angular/router';
import {CustomersComponent} from './customers-index/customers.component';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';
import {CustomerViewComponent} from './customer-view/customer-view.component';

export const customersRouting = RouterModule.forChild([
  { path : '', component : CustomersComponent, canActivate: [CustomersAclGuard] },
  { path : ':id', component : CustomerViewComponent, canActivate: [CustomersAclGuard], canDeactivate: [CustomersAclGuard] }
]);

