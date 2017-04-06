import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {DashboardComponent} from './dashboard.component';

export const dashboardRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : DashboardComponent },
      { path : '**', redirectTo: '' }
    ]
  }
]);

