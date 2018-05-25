import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManagementGeneralComponent } from './account-management-general/account-management-general.component';
import {accountManagementRouting} from './account-management.routing';
import { AccountManagementBillingComponent } from './account-management-billing/account-management-billing.component';
import { AccountManagementUsersComponent } from './account-management-users/account-management-users.component';
import { AccountManagementRolesComponent } from './account-management-roles/account-management-roles.component';
import {AccountManagementApikeysComponent} from './account-management-apikeys/account-management-apikeys.component';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import { AccountManagementHeaderComponent } from './account-management-header/account-management-header.component';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    accountManagementRouting,
    MaterialSelectionModule,
    ClipboardModule
  ],
  declarations: [
    AccountManagementGeneralComponent,
    AccountManagementBillingComponent,
    AccountManagementUsersComponent,
    AccountManagementRolesComponent,
    AccountManagementApikeysComponent,
    AccountManagementHeaderComponent
  ]
})
export class AccountManagementModule { }
