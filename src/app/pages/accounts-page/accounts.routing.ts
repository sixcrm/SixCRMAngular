import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountViewComponent} from './account-view/account-view.component';
import {AccountsComponent} from './account-index/accounts.component';
import {AccountsAclGuard} from '../guards/accounts-acl-guard.service';

const routes: Routes = [
  { path : '', component : AccountsComponent, canActivate: [AccountsAclGuard] },
  { path : ':id', component : AccountViewComponent, canActivate: [AccountsAclGuard], canDeactivate: [AccountsAclGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class accountsRouting {
}

