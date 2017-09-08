import {RouterModule} from '@angular/router';
import {ProductSchedulesComponent} from './product-schedules-index/product-schedules.component';
import {ProductSchedulesAclGuard} from '../guards/product-schedules-acl-guard.service';
import {ProductScheduleViewComponent} from './product-schedule-view/product-schedule-view.component';

export const productSchedulesRouting = RouterModule.forChild([
  { path : '', component : ProductSchedulesComponent, canActivate: [ProductSchedulesAclGuard] },
  { path : ':id', component : ProductScheduleViewComponent, canActivate: [ProductSchedulesAclGuard], canDeactivate: [ProductSchedulesAclGuard] }
]);

