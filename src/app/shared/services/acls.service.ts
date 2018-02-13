import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {Acl} from '../models/acl.model';
import {
  createAclMutation, deleteAclMutation, updateAclMutation,
  updateUserAclTermsAndConditions, deleteAclsMutation
} from '../utils/queries/entities/acl.queries';
import {MdSnackBar} from '@angular/material';
import {Response} from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class AclsService extends AbstractEntityService<Acl> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Acl(data),
      null,
      null,
      deleteAclMutation,
      deleteAclsMutation,
      createAclMutation,
      updateAclMutation,
      'useracl',
      snackBar
    );
  }

  updateUserAclTermsAndConditions(acl: Acl, version: string): Observable<Response> {
    return this.queryRequest(updateUserAclTermsAndConditions(acl, version), {ignoreTermsAndConditions: true})
  }

}
