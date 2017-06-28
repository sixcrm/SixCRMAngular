import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {LoadBalancer} from '../models/load-balancer.model';
import {
  loadBalancersInfoListQuery, loadBalancerQuery,
  deleteLoadBalancerMutation, createLoadBalancerMutation, updateLoadBalancerMutation
} from '../utils/queries/entities/load-balancer.queries';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class LoadBalancersService extends AbstractEntityService<LoadBalancer> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new LoadBalancer(data),
      loadBalancersInfoListQuery,
      loadBalancerQuery,
      deleteLoadBalancerMutation,
      createLoadBalancerMutation,
      updateLoadBalancerMutation,
      'loadbalancer'
    );
  }
}
