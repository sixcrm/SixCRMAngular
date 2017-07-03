import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Rebill} from '../models/rebill.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  rebillsListQuery, rebillQuery, deleteRebillMutation,
  updateRebillMutation
} from '../utils/queries/entities/rebill.queries';

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
