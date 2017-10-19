import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {reportsRouting} from './reports.routing';
import { ReportTableComponent } from './components/report-table/report-table.component';
import {MaterialModule} from '@angular/material';
import {Daterangepicker} from 'ng2-daterangepicker';
import {ChartsModule} from '../charts/charts.module';
import {FormsModule} from '@angular/forms';
import {AnalyticsAclGuard} from '../pages/guards/analytics-acl-guard.service';
import {PageComponentsModule} from '../pages/components/pages-components.module';
import {SummaryReportComponent} from './summary-report/summary-report.component';
import {TransactionsReportComponent} from './transactions-report/transactions-report.component';
import { MerchantReportComponent } from './merchant-report/merchant-report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PageComponentsModule,
    reportsRouting,
    MaterialModule.forRoot(),
    Daterangepicker,
    ChartsModule
  ],
  declarations: [SummaryReportComponent, TransactionsReportComponent, ReportTableComponent, MerchantReportComponent],
  providers: [AnalyticsAclGuard]
})
export class ReportsModule { }
