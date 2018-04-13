import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartsModule} from '../../charts/charts.module';
import {SharedModule} from '../../shared/shared.module';
import {PageComponentsModule} from '../components/pages-components.module';
import {FormsModule} from '@angular/forms';
import {billsRouting} from './bills.routing';
import {BillsOverviewComponent} from './bill-index/bills-overview/bills-overview.component';
import {InvoiceTableComponent} from './bill-index/invoice-table/invoice-table.component';
import {InvoiceOverdueComponent} from './bill-index/invoice-overdue/invoice-overdue.component';
import {BillingSummaryComponent} from './bill-index/billing-summary/billing-summary.component';
import { BillsComponent } from './bill-index/bills.component';
import {BillsAclGuard} from '../guards/bills-acl-guard.service';
import { BillAddNewComponent } from './bill-view/bill-add-new/bill-add-new.component';
import {BillBodyComponent} from './bill-view/bill-body/bill-body.component';
import {BillViewComponent} from './bill-view/bill-view.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports: [
    billsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    ChartsModule,
    TranslationModule
  ],
  declarations: [
    BillsOverviewComponent,
    BillViewComponent,
    BillBodyComponent,
    InvoiceTableComponent,
    InvoiceOverdueComponent,
    BillingSummaryComponent,
    BillsComponent,
    BillAddNewComponent
  ],
  exports: [
    BillsOverviewComponent,
    BillBodyComponent,
    InvoiceTableComponent,
    InvoiceOverdueComponent,
    BillingSummaryComponent
  ],
  providers: [
    BillsAclGuard
  ]
})
export class BillsModule { }
