import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {productSchedulesRouting} from './product-schedules.routing';
import {ProductSchedulesComponent} from './product-schedules-index/product-schedules.component';
import {ProductSchedulesAclGuard} from '../guards/product-schedules-acl-guard.service';
import {ProductScheduleViewComponent} from './product-schedule-view/product-schedule-view.component';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';
import { ProductScheduleCampaignsComponent } from './product-schedule-view/product-schedule-campaigns/product-schedule-campaigns.component';
import { ProductScheduleAddNewComponent } from './product-schedule-view/product-schedule-add-new/product-schedule-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
import { ProductScheduleGalleryComponent } from './product-schedule-view/product-schedule-gallery/product-schedule-gallery.component';

@NgModule({
  imports : [
    productSchedulesRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TextMaskModule,
    TranslationModule
  ],
  declarations : [
    ProductSchedulesComponent,
    ProductScheduleViewComponent,
    ProductScheduleCampaignsComponent,
    ProductScheduleAddNewComponent,
    ProductScheduleGalleryComponent
  ],
  exports : [ ],
  providers: [
    ProductSchedulesAclGuard
  ]
})
export class ProductSchedulesModule {
}
