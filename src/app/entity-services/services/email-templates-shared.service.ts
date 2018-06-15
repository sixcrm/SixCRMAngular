import { Injectable } from '@angular/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {emailTemplatesSharedListQuery, emailTemplateSharedQuery} from '../../shared/utils/queries/entities/email-template.queries';
import {Subject} from 'rxjs';
import {EmailTemplatesService} from './email-templates.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class EmailTemplatesSharedService extends EmailTemplatesService {

  tokens: Subject<any> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      snackBar
    );

    this.indexQuery = emailTemplatesSharedListQuery;
    this.viewQuery = emailTemplateSharedQuery;
  }

}
