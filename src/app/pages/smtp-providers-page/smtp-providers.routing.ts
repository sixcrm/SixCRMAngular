import {RouterModule} from '@angular/router';
import {SmtpProvidersComponent} from './smtp-providers-index/smtp-providers.component';
import {SmtpProvidersAclGuard} from '../guards/smtp-providers-acl-guard.service';
import {SmtpProviderViewComponent} from './smtp-provider-view/smtp-provider-view.component';

export const smtpProvidersRouting = RouterModule.forChild([
  { path : '', component : SmtpProvidersComponent, canActivate: [SmtpProvidersAclGuard] },
  { path : ':id', component : SmtpProviderViewComponent, canActivate: [SmtpProvidersAclGuard] }
]);

