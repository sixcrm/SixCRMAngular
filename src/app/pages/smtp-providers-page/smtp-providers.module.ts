import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {smtpProvidersRouting} from './smtp-providers.routing';
import {SmtpProvidersComponent} from './smtp-providers-index/smtp-providers.component';
import {SmtpProvidersAclGuard} from '../guards/smtp-providers-acl-guard.service';
import {SmtpProviderViewComponent} from './smtp-provider-view/smtp-provider-view.component';
import {SharedModule} from '../../shared/shared.module';
import { SmtpProviderAddNewComponent } from './smtp-provider-view/smtp-provider-add-new/smtp-provider-add-new.component';
import { SmtpProviderValidateComponent } from './smtp-provider-view/smtp-provider-validate/smtp-provider-validate.component';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports : [
    smtpProvidersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TranslationModule
  ],
  declarations : [
    SmtpProvidersComponent,
    SmtpProviderViewComponent,
    SmtpProviderAddNewComponent,
    SmtpProviderValidateComponent
  ],
  exports : [ ],
  providers: [
    SmtpProvidersAclGuard
  ]
})
export class SmtpProvidersModule {
}
