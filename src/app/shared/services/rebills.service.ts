import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Rebill} from '../models/rebill.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {rebillsListQuery, rebillQuery, deleteRebillMutation, updateRebillMutation} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class RebillsService extends AbstractEntityService<Rebill>{

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Rebill(data),
      rebillsListQuery,
      rebillQuery,
      deleteRebillMutation,
      null,
      updateRebillMutation,
      'rebill'
    )
  }

}
