import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {LoadBalancer} from '../models/load-balancers.model';
import {Subject} from 'rxjs';
import {loadBalancersInfoListQuery, loadBalancerQuery, deleteLoadBalancerMutation} from '../utils/query-builder';

@Injectable()
export class LoadBalancersService extends AbstractEntityService {

  loadBalancers$: Subject<LoadBalancer[]>;
  loadBalancer$: Subject<LoadBalancer>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);
    this.loadBalancers$ = new Subject<LoadBalancer[]>();
    this.loadBalancer$ = new Subject<LoadBalancer>();
  }

  getLoadBalancers(): void {
    this.queryRequest(loadBalancersInfoListQuery()).subscribe(
      (data) => {
        let loadBalancerData = data.json().data.loadbalancerlist.loadbalancers;
        this.loadBalancers$.next(loadBalancerData.map(loadBalancer => new LoadBalancer(loadBalancer)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getLoadBalancer(id: string): void {
    this.queryRequest(loadBalancerQuery(id)).subscribe(
      (data) => {
        let loadBalancerData = data.json().data.loadbalancer;
        this.loadBalancer$.next(new LoadBalancer(loadBalancerData));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteEntity(id: string): void {
    this.queryRequest(deleteLoadBalancerMutation(id)).subscribe(
      (success) => this.getLoadBalancers(),
      (error) => console.error(error)
    );
  }

  editEntity(entity: LoadBalancer): void {
  }

}
