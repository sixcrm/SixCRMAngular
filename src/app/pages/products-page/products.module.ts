import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {productsRouting} from './products.routing';
import {MaterialModule} from '@angular/material';
import {ProductsComponent} from './products.component';
import {ProductViewComponent} from './product-view/product-view.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    productsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    ProductsComponent,
    ProductViewComponent
  ],
  exports : [ ],
  providers: [
    ProductsAclGuard
  ]
})
export class ProductsModule {
}
