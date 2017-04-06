import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {LoadBalancersComponent} from './load-balancers.component';
import {LoadBalancersAclGuard} from '../guards/load-balancers-acl-guard.service';
import {LoadBalancerViewComponent} from './load-balancer-view/load-balancer-view.component';

export const loadBalancersRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : LoadBalancersComponent, canActivate: [LoadBalancersAclGuard] },
      { path : ':id', component : LoadBalancerViewComponent, canActivate: [LoadBalancersAclGuard] },
    ]
  }
]);

