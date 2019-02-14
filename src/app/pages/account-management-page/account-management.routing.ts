import {RouterModule} from '@angular/router';
import {AccountManagementGeneralComponent} from './account-management-general/account-management-general.component';
import {AccountManagementBillingComponent} from './account-management-billing/account-management-billing.component';
import {AccountManagementUsersComponent} from './account-management-users/account-management-users.component';
import {AccountManagementRolesComponent} from './account-management-roles/account-management-roles.component';
import {AccountManagementApikeysComponent} from './account-management-apikeys/account-management-apikeys.component';
import {AccountManagementRoleViewComponent} from './account-management-roles/account-management-role-view/account-management-role-view.component';
import {BillingGuard} from './billing-guard.service';

export const accountManagementRouting = RouterModule.forChild([
  { path : '', redirectTo: 'general' },
  { path : 'general', component : AccountManagementGeneralComponent },
  { path : 'billing', component : AccountManagementBillingComponent, canActivate: [BillingGuard] },
  { path : 'users', component : AccountManagementUsersComponent },
  { path : 'roles', component : AccountManagementRolesComponent },
  { path : 'roles/:id', component : AccountManagementRoleViewComponent },
  { path : 'apikeys', component : AccountManagementApikeysComponent }
]);

