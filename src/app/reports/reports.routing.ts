import {RouterModule} from '@angular/router';
import {ComingSoonComponent} from '../shared/components/coming-soon/coming-soon.component';
import {AnalyticsAclGuard} from '../pages/guards/analytics-acl-guard.service';
import {SummaryReportComponent} from './summary-report/summary-report.component';
import {TransactionsReportComponent} from './transactions-report/transactions-report.component';
import {MerchantReportComponent} from './merchant-report/merchant-report.component';
import {AffiliateReportComponent} from './affiliate-report/affiliate-report.component';

export const reportsRouting = RouterModule.forChild([
  {path : 'order', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'summary', component : SummaryReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'transaction', component : TransactionsReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'merchant', component : MerchantReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'affiliate', component : AffiliateReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'fulfillment', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'affiliate', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'retention', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'projection', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]}
]);

