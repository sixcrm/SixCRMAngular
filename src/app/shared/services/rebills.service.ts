import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Rebill} from '../models/rebill.model';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {rebillsListQuery} from '../utils/query-builder';

@Injectable()
export class RebillsService extends AbstractEntityService<Rebill>{

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Rebill(data),
      rebillsListQuery,
      null,
      null,
      null,
      null,
      'rebill'
    )
  }

}
