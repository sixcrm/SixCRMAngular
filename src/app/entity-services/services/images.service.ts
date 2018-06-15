import { Injectable } from '@angular/core';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {uploadImage} from '../../shared/utils/queries/images.queries';
import {SixImage} from '../../shared/models/six-image.model';
import {AbstractEntityService} from './abstract-entity.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class ImagesService extends AbstractEntityService<SixImage> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new SixImage(data),
      null,
      null,
      null,
      null,
      uploadImage,
      null,
      null,
      'default',
      snackBar
    );
  }

}
