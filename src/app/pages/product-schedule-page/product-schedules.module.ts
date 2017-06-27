import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {productSchedulesRouting} from './product-schedules.routing';
import {ProductSchedulesComponent} from './product-schedules.component';
import {ProductSchedulesAclGuard} from '../guards/product-schedules-acl-guard.service';
import {ProductScheduleViewComponent} from './product-schedule-view/product-schedule-view.component';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports : [
    productSchedulesRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TextMaskModule
  ],
  declarations : [
    ProductSchedulesComponent,
    ProductScheduleViewComponent
  ],
  exports : [ ],
  providers: [
    ProductSchedulesAclGuard
  ]
})
export class ProductSchedulesModule {
}
