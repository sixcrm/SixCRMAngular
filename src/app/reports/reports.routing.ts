import {RouterModule} from '@angular/router';
import {ComingSoonComponent} from '../shared/components/coming-soon/coming-soon.component';
import {AnalyticsAclGuard} from '../pages/guards/analytics-acl-guard.service';
import {MerchantReportComponent} from './merchant-report/merchant-report.component';
import {AffiliateReportComponent} from './affiliate-report/affiliate-report.component';

export const reportsRouting = RouterModule.forChild([
  {path : 'merchant', component : MerchantReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'affiliate', component : AffiliateReportComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'daytoday', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]},
  {path : 'cycle', component : ComingSoonComponent, canActivate: [AnalyticsAclGuard]}
]);

