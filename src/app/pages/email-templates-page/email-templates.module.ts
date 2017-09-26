import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {EmailTemplatesComponent} from './email-templates-index/email-templates.component';
import {EmailTemplatesAclGuard} from '../guards/email-templates-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {emailTemplatesRouting} from './email-templates.routing';
import {EmailTemplateViewComponent} from './email-template-view/email-template-view.component';
import { TokenListComponent } from './email-template-view/token-list/token-list.component';
import { TokenViewComponent } from './email-template-view/token-view/token-view.component';
import { FilterTokensTypePipe } from './email-template-view/filter-tokens-type.pipe';
import { EmailTemplateAddNewComponent } from './email-template-view/email-template-add-new/email-template-add-new.component';

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    emailTemplatesRouting
  ],
  declarations : [
    EmailTemplatesComponent,
    EmailTemplateViewComponent,
    TokenListComponent,
    TokenViewComponent,
    FilterTokensTypePipe,
    EmailTemplateAddNewComponent
  ],
  providers: [
    EmailTemplatesAclGuard
  ]
})
export class EmailTemplatesModule {
}
