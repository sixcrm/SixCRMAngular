import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {fulfillmentProvidersRouting} from './fulfillment-providers.routing';
import {FulfillmentProvidersComponent} from './fulfillment-providers-index/fulfillment-providers.component';
import {FulfillmentProvidersAclGuard} from '../guards/fulfillment-providers-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';
import {FulfillmentProviderViewComponent} from './fulfillment-provider-view/fulfillment-provider-view.component';
import { FulfillmentProviderAddNewComponent } from './fulfillment-provider-view/fulfillment-provider-add-new/fulfillment-provider-add-new.component';
import { FulfillmentProviderValidationComponent } from './fulfillment-provider-view/fulfillment-provider-validation/fulfillment-provider-validation.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    fulfillmentProvidersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TranslationModule
  ],
  declarations : [
    FulfillmentProvidersComponent,
    FulfillmentProviderViewComponent,
    FulfillmentProviderAddNewComponent,
    FulfillmentProviderValidationComponent
  ],
  exports : [ ],
  providers: [
    FulfillmentProvidersAclGuard
  ]
})
export class FulfillmentProvidersModule {
}
