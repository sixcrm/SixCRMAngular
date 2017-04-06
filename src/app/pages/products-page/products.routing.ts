import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {ProductsComponent} from './products.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {ProductViewComponent} from './product-view/product-view.component';

export const productsRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : ProductsComponent, canActivate: [ProductsAclGuard] },
      { path : ':id', component : ProductViewComponent, canActivate: [ProductsAclGuard] },
    ]
  }
]);

