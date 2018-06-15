import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import {TranslationModule} from '../../translation/translation.module';
import { EmailTemplatesSharedComponent } from './email-templates-index/email-templates-shared/email-templates-shared.component';
import { EmailTemplatesCustomComponent } from './email-templates-index/email-templates-custom/email-templates-custom.component';
import { SharedListComponent } from './email-template-view/shared-list/shared-list.component';
import { FilterTemplatesByTypePipe } from './filter-templates-by-type.pipe';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    emailTemplatesRouting,
    TranslationModule
  ],
  declarations : [
    EmailTemplatesComponent,
    EmailTemplateViewComponent,
    TokenListComponent,
    TokenViewComponent,
    FilterTokensTypePipe,
    EmailTemplateAddNewComponent,
    EmailTemplatesSharedComponent,
    EmailTemplatesCustomComponent,
    SharedListComponent,
    FilterTemplatesByTypePipe
  ],
  providers: [
    EmailTemplatesAclGuard
  ]
})
export class EmailTemplatesModule {
}
