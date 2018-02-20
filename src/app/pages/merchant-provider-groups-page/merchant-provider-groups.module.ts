import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from '../../translation/translation.module';
import {MerchantProviderGroupViewComponent} from './merchant-provider-group-view/merchant-provider-group-view.component';
import {MerchantProviderGroupAddNewComponent} from './merchant-provider-group-view/merchant-provider-group-add-new/merchant-provider-group-add-new.component';
import {MerchantProviderGroupsComponent} from './merchant-provider-groups-index/merchant-provider-groups.component';
import {MerchantProviderGroupsAclGuard} from '../guards/merchant-provider-group-acl-guard.service';
import {merchantProviderGroupsRouting} from './merchant-provider-groups.routing';

@NgModule({
  imports : [
    merchantProviderGroupsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TranslationModule
  ],
  declarations : [
    MerchantProviderGroupsComponent,
    MerchantProviderGroupViewComponent,
    MerchantProviderGroupAddNewComponent
  ],
  exports : [ ],
  providers: [
    MerchantProviderGroupsAclGuard
  ]
})
export class MerchantProviderGroupsModule {
}
