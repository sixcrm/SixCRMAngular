import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {productsRouting} from './products.routing';
import {ProductsComponent} from './products-index/products.component';
import {ProductViewComponent} from './product-view/product-view.component';
import {ProductsAclGuard} from '../guards/products-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';
import { ProductImagesGalleryComponent } from './product-view/product-images-gallery/product-images-gallery.component';
import { ProductEmailsComponent } from './product-view/product-emails/product-emails.component';

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
    ProductImagesGalleryComponent,
    ProductEmailsComponent
  ],
  exports : [ ],
  providers: [
    ProductsAclGuard
  ]
})
export class ProductsModule {
}
