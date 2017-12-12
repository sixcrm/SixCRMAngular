import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {accountsRouting} from './accounts.routing';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {AccountsAclGuard} from '../guards/accounts-acl-guard.service';
import { AccountViewComponent } from './account-view/account-view.component';
import {AccountsComponent} from './account-index/accounts.component';
import { AccountAddNewComponent } from './account-view/account-add-new/account-add-new.component';
import {AccessKeysComponent} from '../access-keys-page/access-keys-index/access-keys.component';
import { BillIndexComponent } from './bill-index/bills.component';
import { BillViewComponent } from './bill-view/bill-view.component';
import { InvoiceComponent } from './bill-index/invoice/invoice.component';
import { AddUpdateInvoiceComponent } from './bill-index/add-update-invoice/add-update-invoice.component';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports: [
    accountsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TranslationModule
  ],
  declarations: [
    AccountViewComponent,
    AccountsComponent,
    AccountAddNewComponent,
    AccessKeysComponent,
    BillIndexComponent,
    BillViewComponent,
    InvoiceComponent,
    AddUpdateInvoiceComponent
  ],
  providers: [AccountsAclGuard]
})
export class AccountsModule { }
