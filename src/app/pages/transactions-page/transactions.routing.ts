import {RouterModule} from '@angular/router';
import {TransactionsComponent} from './transactions.component';
import {TransactionsAclGuard} from '../guards/transactions-acl-guard.service';
import {TransactionViewComponent} from './transaction-view/transaction-view.component';

export const transactionsRouting = RouterModule.forChild([
  { path : '', component : TransactionsComponent, canActivate: [TransactionsAclGuard] },
  { path : ':id', component : TransactionViewComponent, canActivate: [TransactionsAclGuard] }
]);

