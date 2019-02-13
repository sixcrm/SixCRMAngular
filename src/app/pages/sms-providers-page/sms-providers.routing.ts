import {RouterModule} from '@angular/router';
import {SmsProvidersComponent} from './sms-providers-index/sms-providers.component';
import {SmsProviderViewComponent} from './sms-provider-view/sms-provider-view.component';

export const smsProvidersRouting = RouterModule.forChild([
  { path : '', component : SmsProvidersComponent },
  { path : ':id', component : SmsProviderViewComponent }
]);

