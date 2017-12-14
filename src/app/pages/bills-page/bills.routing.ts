import {RouterModule} from '@angular/router';
import {BillsComponent} from './bill-index/bills.component';
import {BillsAclGuard} from '../guards/bills-acl-guard.service';
import {BillViewComponent} from './bill-view/bill-view.component';

export const billsRouting = RouterModule.forChild([
  { path : '', component : BillsComponent, canActivate: [BillsAclGuard] },
  { path : ':id', component : BillViewComponent, canActivate: [BillsAclGuard], canDeactivate: [BillsAclGuard] }
]);

