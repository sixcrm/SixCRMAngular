import {RouterModule} from '@angular/router';
import {CustomerAdvancedComponent} from './customer-advanced.component';

export const customerAdvancedRouting = RouterModule.forChild([
  { path : ':id', component : CustomerAdvancedComponent }
]);

