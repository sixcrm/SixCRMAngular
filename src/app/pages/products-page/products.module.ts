import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {productsRouting} from './products.routing';
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
import { ProductAttributesComponent } from './product-view/product-attributes/product-attributes.component';
import { ProductImagesComponent } from './product-view/product-images/product-images.component';
import { SortByDefaultPipe } from './product-view/product-images/sort-by-default.pipe';
import {ProductMerchantProviderGroupAssociationsComponent} from './product-view/product-merchant-provider-group-associations/product-merchant-provider-group-associations.component';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    productsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TextMaskModule,
    TranslationModule
  ],
  declarations : [
    ProductsComponent,
    ProductViewComponent,
    ProductProductSchedulesComponent,
    ProductCampaignsComponent,
    ProductAddNewComponent,
    ProductAttributesComponent,
    ProductImagesComponent,
    SortByDefaultPipe,
    ProductMerchantProviderGroupAssociationsComponent
  ],
  exports : [ ],
  providers: [
    ProductsAclGuard
  ]
})
export class ProductsModule {
}
