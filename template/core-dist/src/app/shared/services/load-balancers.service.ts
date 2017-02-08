import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {LoadBalancer} from '../models/load-balancers.model';
import {
  loadBalancersInfoListQuery, loadBalancerQuery, deleteLoadBalancerMutation,
  createLoadBalancerMutation, updateLoadBalancerMutation
} from '../utils/query-builder';

@Injectable()
export class LoadBalancersService extends AbstractEntityService<LoadBalancer> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new LoadBalancer(data),
      loadBalancersInfoListQuery,
      loadBalancerQuery,
      deleteLoadBalancerMutation,
      createLoadBalancerMutation,
      updateLoadBalancerMutation
    );
  }
}
