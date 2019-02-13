import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {smsProvidersRouting} from './sms-providers.routing';
import {SmsProvidersComponent} from './sms-providers-index/sms-providers.component';
import {SmsProviderViewComponent} from './sms-provider-view/sms-provider-view.component';
import {SharedModule} from '../../shared/shared.module';
import {SmsProviderAddNewComponent} from './sms-provider-view/sms-provider-add-new/sms-provider-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';
import {SmsProviderValidateComponent} from './sms-provider-view/sms-provider-validate/sms-provider-validate.component';

@NgModule({
  imports : [
    smsProvidersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TranslationModule
  ],
  declarations : [
    SmsProvidersComponent,
    SmsProviderViewComponent,
    SmsProviderAddNewComponent,
    SmsProviderValidateComponent
  ],
  exports : [ ],
  providers: [ ]
})
export class SmsProvidersModule {
}
