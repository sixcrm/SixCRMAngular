import { Injectable } from '@angular/core';
import {Affiliate} from '../models/affiliate.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {
  affiliatesListQuery, affiliateQuery, deleteAffiliateMutation,
  createAffiliateMutation, updateAffiliateMutation
} from '../utils/query-builder';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class AffiliatesService extends AbstractEntityService<Affiliate> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Affiliate(data),
      affiliatesListQuery,
      affiliateQuery,
      deleteAffiliateMutation,
      createAffiliateMutation,
      updateAffiliateMutation,
      'affiliate'
    );
  }
}
