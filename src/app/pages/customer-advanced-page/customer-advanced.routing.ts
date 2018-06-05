import {RouterModule} from '@angular/router';
import {CustomerAdvancedCustomerComponent} from './customer-advanced-customer/customer-advanced-customer.component';

export const customerAdvancedRouting = RouterModule.forChild([
  { path : ':id', component : CustomerAdvancedCustomerComponent }
]);

