import {RouterModule} from '@angular/router';
import {LoadBalancersComponent} from './load-balancers-index/load-balancers.component';
import {LoadBalancersAclGuard} from '../guards/load-balancers-acl-guard.service';
import {LoadBalancerViewComponent} from './load-balancer-view/load-balancer-view.component';

export const loadBalancersRouting = RouterModule.forChild([
  { path : '', component : LoadBalancersComponent, canActivate: [LoadBalancersAclGuard] },
  { path : ':id', component : LoadBalancerViewComponent, canActivate: [LoadBalancersAclGuard] }
]);

