import {RouterModule} from '@angular/router';
import {OrdersComponent} from './orders-index/orders.component';
import {RebillsAclGuard} from '../guards/rebills-acl-guard.service';

export const ordersRouting = RouterModule.forChild([
  { path : '', component : OrdersComponent, canActivate: [RebillsAclGuard]}
]);

