import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {Acl} from '../models/acl.model';
import {
  createAclMutation, deleteAclMutation, updateAclMutation,
  updateUserAclTermsAndConditions, deleteAclsMutation, aclListQuery
} from '../utils/queries/entities/acl.queries';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {CustomServerError} from '../models/errors/custom-server-error';

@Injectable()
export class AclsService extends AbstractEntityService<Acl> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Acl(data),
      aclListQuery,
      null,
      deleteAclMutation,
      deleteAclsMutation,
      createAclMutation,
      updateAclMutation,
      'useracl',
      snackBar
    );
  }

  updateUserAclTermsAndConditions(acl: Acl, version: string): Observable<CustomServerError | HttpResponse<any>> {
    return this.queryRequest(updateUserAclTermsAndConditions(acl, version), {ignoreTermsAndConditions: true})
  }

}
