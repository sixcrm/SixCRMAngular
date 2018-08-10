import {RouterModule} from '@angular/router';
import {OrdersComponent} from './orders-index/orders.component';

export const ordersRouting = RouterModule.forChild([
  { path : '', component : OrdersComponent}
]);

