import {RouterModule} from '@angular/router';
import {ProductsComponent} from './products-index/products.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {ProductViewComponent} from './product-view/product-view.component';
import {ProductScheduleViewComponent} from './product-schedule-view/product-schedule-view.component';

export const productsRouting = RouterModule.forChild([
  { path : '', component : ProductsComponent, canActivate: [ProductsAclGuard] },
  { path : 'product/:id', component : ProductViewComponent, canActivate: [ProductsAclGuard], canDeactivate: [ProductsAclGuard] },
  { path : 'schedule/:id', component : ProductScheduleViewComponent, canActivate: [ProductsAclGuard], canDeactivate: [ProductsAclGuard] }
]);

