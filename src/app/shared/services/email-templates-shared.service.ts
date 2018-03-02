import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {emailTemplatesSharedListQuery, emailTemplateSharedQuery} from '../utils/queries/entities/email-template.queries';
import {MdSnackBar} from '@angular/material';
import {Subject} from 'rxjs';
import {EmailTemplatesService} from './email-templates.service';

@Injectable()
export class EmailTemplatesSharedService extends EmailTemplatesService {

  tokens: Subject<any> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      snackBar
    );

    this.indexQuery = emailTemplatesSharedListQuery;
    this.viewQuery = emailTemplateSharedQuery;
  }

}
