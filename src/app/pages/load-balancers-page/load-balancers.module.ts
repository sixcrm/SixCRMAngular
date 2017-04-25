import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {loadBalancersRouting} from './load-balancers.routing';
import {LoadBalancersComponent} from './load-balancers.component';
import {LoadBalancerComponent} from './load-balancer/load-balancer.component';
import {LoadBalancersAclGuard} from '../guards/load-balancers-acl-guard.service';
import {LoadBalancerViewComponent} from './load-balancer-view/load-balancer-view.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    loadBalancersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    LoadBalancersComponent,
    LoadBalancerViewComponent,
    LoadBalancerComponent
  ],
  exports : [
    LoadBalancerComponent
  ],
  providers: [
    LoadBalancersAclGuard
  ]
})
export class LoadBalancersModule {
}
