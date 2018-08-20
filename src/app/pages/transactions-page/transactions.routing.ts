import {RouterModule} from '@angular/router';
import {TransactionsComponent} from './transactions-index/transactions.component';
import {TransactionsAclGuard} from '../guards/transactions-acl-guard.service';

export const transactionsRouting = RouterModule.forChild([
  { path : '', component : TransactionsComponent, canActivate: [TransactionsAclGuard] }
]);

