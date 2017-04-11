import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';

export const dashboardRouting = RouterModule.forChild([
  { path : '', component : DashboardComponent },
  { path : '**', redirectTo: '' }
]);

