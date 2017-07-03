import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {productsRouting} from './products.routing';
import {MaterialModule} from '@angular/material';
import {ProductsComponent} from './products-index/products.component';
import {ProductViewComponent} from './product-view/product-view.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {ProductProductSchedulesComponent} from './product-view/product-product-schedules/product-product-schedules.component';
import { ProductCampaignsComponent } from './product-view/product-campaigns/product-campaigns.component';

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
    ProductViewComponent,
    ProductProductSchedulesComponent,
    ProductCampaignsComponent
  ],
  exports : [ ],
  providers: [
    ProductsAclGuard
  ]
})
export class ProductsModule {
}
