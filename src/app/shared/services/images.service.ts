import { Injectable } from '@angular/core';
import {HttpWrapperService} from './http-wrapper.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {uploadImage} from '../utils/queries/images.queries';
import {SixImage} from '../models/six-image.model';
import {AbstractEntityService} from './abstract-entity.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class ImagesService extends AbstractEntityService<SixImage> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
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
      'default',
      snackBar
    );
  }

}