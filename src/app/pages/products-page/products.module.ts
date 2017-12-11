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
import {TextMaskModule} from 'angular2-text-mask';
import { ProductAddNewComponent } from './product-view/product-add-new/product-add-new.component';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports : [
    productsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TextMaskModule,
    TranslationModule
  ],
  declarations : [
    ProductsComponent,
    ProductViewComponent,
    ProductProductSchedulesComponent,
    ProductCampaignsComponent,
    ProductAddNewComponent
  ],
  exports : [ ],
  providers: [
    ProductsAclGuard
  ]
})
export class ProductsModule {
}
