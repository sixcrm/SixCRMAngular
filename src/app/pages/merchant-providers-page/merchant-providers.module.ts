import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {merchantProvidersRouting} from './merchant-providers.routing';
import {MerchantProvidersComponent} from './merchant-providers.component';
import {MerchantProviderComponent} from './merchant-provider/merchant-provider.component';
import {MerchantProvidersAclGuard} from '../guards/merchant-providers-acl-guard.service';
import {MerchantProviderViewComponent} from './merchant-provider-view/merchant-provider-view.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    merchantProvidersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    MerchantProvidersComponent,
    MerchantProviderViewComponent,
    MerchantProviderComponent
  ],
  exports : [
    MerchantProviderComponent
  ],
  providers: [
    MerchantProvidersAclGuard
  ]
})
export class MerchantProvidersModule {
}
