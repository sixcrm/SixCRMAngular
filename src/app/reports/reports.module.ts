import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {reportsRouting} from './reports.routing';
import {Daterangepicker} from 'ng2-daterangepicker';
import {ChartsModule} from '../charts/charts.module';
import {FormsModule} from '@angular/forms';
import {AnalyticsAclGuard} from '../pages/guards/analytics-acl-guard.service';
import {PageComponentsModule} from '../pages/components/pages-components.module';
import { MerchantReportComponent } from './merchant-report/merchant-report.component';
import { AffiliateReportComponent } from './affiliate-report/affiliate-report.component';
import {TranslationModule} from "../translation/translation.module";
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {EntityServicesModule} from '../entity-services/entity-services.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    EntityServicesModule,
    PageComponentsModule,
    reportsRouting,
    MaterialSelectionModule,
    Daterangepicker,
    ChartsModule,
    TranslationModule
  ],
  declarations: [
    MerchantReportComponent,
    AffiliateReportComponent
  ],
  providers: [AnalyticsAclGuard]
})
export class ReportsModule { }
