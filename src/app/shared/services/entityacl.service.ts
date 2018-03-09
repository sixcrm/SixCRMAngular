import { Injectable } from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MdSnackBar} from '@angular/material';
import {AbstractEntityService} from './abstract-entity.service';
import {EntityAcl} from '../models/entityacl.model';
import {
  deleteEntityAclMutation, deleteEntityAclsMutation,
  createEntityAclMutation, updateEntityAclMutation, entityAclsListQuery, entityAclQuery
} from '../utils/queries/entities/entity-acl.queries';

@Injectable()
export class EntityAclsService extends AbstractEntityService<EntityAcl>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new EntityAcl(data),
      entityAclsListQuery,
      entityAclQuery,
      deleteEntityAclMutation,
      deleteEntityAclsMutation,
      createEntityAclMutation,
      updateEntityAclMutation,
      'entityacl',
      snackBar
    );
  }

}
