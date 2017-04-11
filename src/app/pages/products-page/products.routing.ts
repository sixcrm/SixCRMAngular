import {RouterModule} from '@angular/router';
import {ProductsComponent} from './products.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {ProductViewComponent} from './product-view/product-view.component';

export const productsRouting = RouterModule.forChild([
  { path : '', component : ProductsComponent, canActivate: [ProductsAclGuard] },
  { path : ':id', component : ProductViewComponent, canActivate: [ProductsAclGuard] }
]);

