import {RouterModule} from '@angular/router';
import {ComingSoonComponent} from '../shared/components/coming-soon/coming-soon.component';
import {TransactionsReportComponent} from './transactions-report/transactions-report.component';

export const reportsRouting = RouterModule.forChild([
  {path : 'order', component : ComingSoonComponent},
  {path : 'transaction', component : TransactionsReportComponent},
  {path : 'fulfillment', component : ComingSoonComponent},
  {path : 'affiliate', component : ComingSoonComponent},
  {path : 'retention', component : ComingSoonComponent},
  {path : 'projection', component : ComingSoonComponent}
]);

