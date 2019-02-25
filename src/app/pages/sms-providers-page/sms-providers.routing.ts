import {RouterModule} from '@angular/router';
import {SmsProvidersComponent} from './sms-providers-index/sms-providers.component';
import {SmsProviderViewComponent} from './sms-provider-view/sms-provider-view.component';
import {SmsProvidersAclGuard} from '../guards/sms-providers-acl-guard.service';

export const smsProvidersRouting = RouterModule.forChild([
  { path : '', component : SmsProvidersComponent, canActivate: [SmsProvidersAclGuard] },
  { path : ':id', component : SmsProviderViewComponent, canActivate: [SmsProvidersAclGuard], canDeactivate: [SmsProvidersAclGuard] }
]);

