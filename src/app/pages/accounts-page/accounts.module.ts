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
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import { MarkdownModule } from 'angular2-markdown';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports: [
    accountsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TranslationModule,
    MarkdownModule
  ],
  declarations: [
    AccountViewComponent,
    AccountsComponent,
    AccountAddNewComponent,
    AccessKeysComponent
  ],
  providers: [AccountsAclGuard]
})
export class AccountsModule { }
