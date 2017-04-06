import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {ProductSchedulesComponent} from './product-schedules.component';
import {ProductSchedulesAclGuard} from '../guards/product-schedules-acl-guard.service';
import {ProductScheduleViewComponent} from './product-schedule-view/product-schedule-view.component';

export const productSchedulesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : ProductSchedulesComponent, canActivate: [ProductSchedulesAclGuard] },
      { path : ':id', component : ProductScheduleViewComponent, canActivate: [ProductSchedulesAclGuard] },
    ]
  }
]);

