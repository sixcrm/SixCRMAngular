import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {merchantProvidersRouting} from './merchant-providers.routing';
import {MerchantProvidersComponent} from './merchant-providers-index/merchant-providers.component';
import {MerchantProvidersAclGuard} from '../guards/merchant-providers-acl-guard.service';
import {MerchantProviderViewComponent} from './merchant-provider-view/merchant-provider-view.component';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';
import { MerchantProviderAddNewComponent } from './merchant-provider-view/merchant-provider-add-new/merchant-provider-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    merchantProvidersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TextMaskModule,
    TranslationModule
  ],
  declarations : [
    MerchantProvidersComponent,
    MerchantProviderViewComponent,
    MerchantProviderAddNewComponent
  ],
  exports : [ ],
  providers: [
    MerchantProvidersAclGuard
  ]
})
export class MerchantProvidersModule {
}
