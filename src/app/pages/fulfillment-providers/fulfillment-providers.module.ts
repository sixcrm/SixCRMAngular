import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {fulfillmentProvidersRouting} from './fulfillment-providers.routing';
import {FulfillmentProvidersComponent} from './fulfillment-providers.component';
import {FulfillmentViewComponent} from './fulfillment-view/fulfillment-view.component';
import {FulfillmentProviderComponent} from './fulfillment-provider/fulfillment-provider.component';
import {FulfillmentProvidersAclGuard} from '../guards/fulfillment-providers-acl-guard.service';

@NgModule({
  imports : [
    fulfillmentProvidersRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    FulfillmentProvidersComponent,
    FulfillmentViewComponent,
    FulfillmentProviderComponent
  ],
  exports : [
    FulfillmentProviderComponent
  ],
  providers: [
    FulfillmentProvidersAclGuard
  ]
})
export class FulfillmentProvidersModule {
}
