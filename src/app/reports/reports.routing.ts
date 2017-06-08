import {RouterModule} from '@angular/router';
import {ComingSoonComponent} from '../shared/components/coming-soon/coming-soon.component';
import {TransactionsReportComponent} from './transactions-report/transactions-report.component';
import {AnalyticsAclGuard} from '../pages/guards/analytics-acl-guard.service';

export const reportsRouting = RouterModule.forChild([
  {path : 'order', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'transaction', component : TransactionsReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'fulfillment', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'affiliate', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'retention', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'projection', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]}
]);

