import {RouterModule} from '@angular/router';
import {CustomerServiceDashboardComponent} from './customer-service-dashboard/customer-service-dashboard.component';

export const customerServiceRouting = RouterModule.forChild([
  { path : '', component : CustomerServiceDashboardComponent }
]);

