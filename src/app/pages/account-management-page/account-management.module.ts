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
import {ClipboardModule} from 'ngx-clipboard';
import {FormsModule} from '@angular/forms';
import { AccountManagementBillingTransactionsChartComponent } from './account-management-billing/account-management-billing-transactions-chart/account-management-billing-transactions-chart.component';
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import {SharedModule} from '../../shared/shared.module';
import { AccountManagementRoleViewComponent } from './account-management-roles/account-management-role-view/account-management-role-view.component';
import {TextMaskModule} from 'angular2-text-mask';
import { AccountManagementRolesSelectorComponent } from './account-management-roles-selector/account-management-roles-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    accountManagementRouting,
    MaterialSelectionModule,
    ChartModule,
    SharedModule,
    ClipboardModule,
    TextMaskModule
  ],
  declarations: [
    AccountManagementGeneralComponent,
    AccountManagementBillingComponent,
    AccountManagementUsersComponent,
    AccountManagementRolesComponent,
    AccountManagementApikeysComponent,
    AccountManagementHeaderComponent,
    AccountManagementBillingTransactionsChartComponent,
    AccountManagementRoleViewComponent,
    AccountManagementRolesSelectorComponent
  ],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: () => require('highcharts/highstock')
    }
  ]
})
export class AccountManagementModule { }
