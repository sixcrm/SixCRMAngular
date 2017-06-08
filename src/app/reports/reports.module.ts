import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {reportsRouting} from './reports.routing';
import { TransactionsReportComponent } from './transactions-report/transactions-report.component';
import { ReportTableComponent } from './components/report-table/report-table.component';
import {MaterialModule} from '@angular/material';
import {Daterangepicker} from 'ng2-daterangepicker';
import {ChartsModule} from '../charts/charts.module';
import {FormsModule} from '@angular/forms';
import {AnalyticsAclGuard} from '../pages/guards/analytics-acl-guard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    reportsRouting,
    MaterialModule.forRoot(),
    Daterangepicker,
    ChartsModule
  ],
  declarations: [TransactionsReportComponent, ReportTableComponent],
  providers: [AnalyticsAclGuard]
})
export class ReportsModule { }
