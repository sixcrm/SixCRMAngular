import {Injectable} from "@angular/core";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {LoadBalancerAssociation} from '../models/load-balancer-association.model';
import {
  loadBalancerAssociationsListQuery,
  loadBalancerAssociationQuery, createLoadBalancerAssociationMutation, deleteLoadBalancerAssociationMutation,
  deleteLoadBalancerAssociationssMutation
} from '../utils/queries/entities/load-balancer-associations.queries';

@Injectable()
export class LoadBalancerAssociationsService extends AbstractEntityService<LoadBalancerAssociation> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new LoadBalancerAssociation(data),
      loadBalancerAssociationsListQuery,
      loadBalancerAssociationQuery,
      deleteLoadBalancerAssociationMutation,
      deleteLoadBalancerAssociationssMutation,
      createLoadBalancerAssociationMutation,
      null,
      'loadbalancerassociation',
      snackBar
    );
  }
}
