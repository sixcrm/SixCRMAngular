import {RouterModule} from '@angular/router';
import {CustomerServiceComponent} from './customer-service/customer-service.component';

export const customerServiceDashboardRouting = RouterModule.forChild([
  { path : '', component : CustomerServiceComponent }
]);

