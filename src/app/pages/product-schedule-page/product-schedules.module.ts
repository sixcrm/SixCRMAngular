import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    productSchedulesRouting,
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
    ProductSchedulesComponent,
    ProductScheduleViewComponent,
    ProductScheduleCampaignsComponent,
    ProductScheduleAddNewComponent
  ],
  exports : [ ],
  providers: [
    ProductSchedulesAclGuard
  ]
})
export class ProductSchedulesModule {
}
