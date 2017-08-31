import {RouterModule} from '@angular/router';
import {AccountViewComponent} from './account-view/account-view.component';
import {AccountsComponent} from './account-index/accounts.component';
import {AccountsAclGuard} from '../guards/accounts-acl-guard.service';

export const accountsRouting = RouterModule.forChild([
  { path : '', component : AccountsComponent, canActivate: [AccountsAclGuard] },
  { path : ':id', component : AccountViewComponent, canActivate: [AccountsAclGuard] }
]);

