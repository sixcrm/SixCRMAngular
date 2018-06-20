import {RouterModule} from '@angular/router';
import {CustomersComponent} from './customers-index/customers.component';
import {CustomersAclGuard} from '../guards/customers-acl-guard.service';
import {CustomerAdvancedComponent} from '../customer-advanced-page/customer-advanced.component';

export const customersRouting = RouterModule.forChild([
  { path : '', component : CustomersComponent, canActivate: [CustomersAclGuard] },
  { path : ':id', component : CustomerAdvancedComponent, canActivate: [CustomersAclGuard], canDeactivate: [CustomersAclGuard] }
]);

