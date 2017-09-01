import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {Acl} from '../models/acl.model';
import {createAclMutation, deleteAclMutation, updateAclMutation} from '../utils/queries/entities/acl.queries';

@Injectable()
export class AclsService extends AbstractEntityService<Acl> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Acl(data),
      null,
      null,
      deleteAclMutation,
      createAclMutation,
      updateAclMutation,
      'account'
    );
  }

}
