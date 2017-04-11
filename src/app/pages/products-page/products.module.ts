import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {productsRouting} from './products.routing';
import {MaterialModule} from '@angular/material';
import {ProductsComponent} from './products.component';
import {ProductViewComponent} from './product-view/product-view.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {ProductComponent} from './product/product.component';
import {PageComponentsModule} from '../components/pages-components.module';

@NgModule({
  imports : [
    productsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    ProductsComponent,
    ProductViewComponent,
    ProductComponent
  ],
  exports : [
    ProductComponent
  ],
  providers: [
    ProductsAclGuard
  ]
})
export class ProductsModule {
}
