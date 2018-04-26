import { Injectable } from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {EntityAcl} from '../models/entityacl.model';
import {
  deleteEntityAclMutation, deleteEntityAclsMutation,
  createEntityAclMutation, updateEntityAclMutation, entityAclsListQuery, entityAclQuery
} from '../utils/queries/entities/entity-acl.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class EntityAclsService extends AbstractEntityService<EntityAcl>{

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
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
      null,
      'entityacl',
      snackBar
    );
  }

}
