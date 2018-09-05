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
import { EmailTemplateAddNewComponent } from './email-template-view/email-template-add-new/email-template-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
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
    EmailTemplateAddNewComponent,
    FilterTemplatesByTypePipe
  ],
  providers: [
    EmailTemplatesAclGuard
  ]
})
export class EmailTemplatesModule {
}
