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

@NgModule({
  imports: [
    accountsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
  ],
  declarations: [AccountViewComponent, AccountsComponent, AccountAddNewComponent, AccessKeysComponent],
  providers: [AccountsAclGuard]
})
export class AccountsModule { }
