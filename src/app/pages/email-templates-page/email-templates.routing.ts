import {RouterModule} from '@angular/router';
import {EmailTemplatesComponent} from './email-templates-index/email-templates.component';
import {EmailTemplateViewComponent} from './email-template-view/email-template-view.component';
import {EmailTemplatesAclGuard} from '../guards/email-templates-acl-guard.service';

export const emailTemplatesRouting = RouterModule.forChild([
  { path : '', component : EmailTemplatesComponent, canActivate: [EmailTemplatesAclGuard] },
  { path : ':id', component : EmailTemplateViewComponent, canActivate: [EmailTemplatesAclGuard], canDeactivate: [EmailTemplatesAclGuard] },
]);

