import {RouterModule} from '@angular/router';
import {CustomerServicePairComponent} from './customer-service-pair/customer-service-pair.component';
import {CustomerServiceDashboardComponent} from './customer-service-dashboard/customer-service-dashboard.component';

export const customerServiceRouting = RouterModule.forChild([
  { path : '', component : CustomerServiceDashboardComponent },
  { path : 'pair', component : CustomerServicePairComponent }
]);

