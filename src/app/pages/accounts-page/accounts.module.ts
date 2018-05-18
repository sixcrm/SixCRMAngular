import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {accountsRouting} from './accounts.routing';
import {FormsModule} from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {AccountsAclGuard} from '../guards/accounts-acl-guard.service';
import { AccountViewComponent } from './account-view/account-view.component';
import {AccountsComponent} from './account-index/accounts.component';
import { AccountAddNewComponent } from './account-view/account-add-new/account-add-new.component';
import {AccessKeysComponent} from '../access-keys-page/access-keys-index/access-keys.component';
import {BillsModule} from '../bills-page/bills.module';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {AgreementsComponent} from './account-view/agreements/agreements.component';
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
  imports: [
    accountsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    TranslationModule,
    BillsModule,
    MarkdownModule
  ],
  declarations: [
    AccountViewComponent,
    AccountsComponent,
    AccountAddNewComponent,
    AccessKeysComponent,
    AgreementsComponent
  ],
  providers: [AccountsAclGuard]
})
export class AccountsModule { }
