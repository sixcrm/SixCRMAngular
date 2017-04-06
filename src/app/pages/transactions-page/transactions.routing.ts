import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {TransactionsComponent} from './transactions.component';
import {TransactionsAclGuard} from '../guards/transactions-acl-guard.service';
import {TransactionViewComponent} from './transaction-view/transaction-view.component';

export const transactionsRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : TransactionsComponent, canActivate: [TransactionsAclGuard] },
      { path : ':id', component : TransactionViewComponent, canActivate: [TransactionsAclGuard] },
    ]
  }
]);

