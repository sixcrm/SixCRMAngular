import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {loadBalancersRouting} from './load-balancers.routing';
import {LoadBalancersComponent} from './load-balancers-index/load-balancers.component';
import {LoadBalancersAclGuard} from '../guards/load-balancers-acl-guard.service';
import {LoadBalancerViewComponent} from './load-balancer-view/load-balancer-view.component';
import {SharedModule} from '../../shared/shared.module';
import { LoadBalancerAddNewComponent } from './load-balancer-view/load-balancer-add-new/load-balancer-add-new.component';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports : [
    loadBalancersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    TranslationModule
  ],
  declarations : [
    LoadBalancersComponent,
    LoadBalancerViewComponent,
    LoadBalancerAddNewComponent
  ],
  exports : [ ],
  providers: [
    LoadBalancersAclGuard
  ]
})
export class LoadBalancersModule {
}
