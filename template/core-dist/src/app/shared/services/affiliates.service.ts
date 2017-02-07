import { Injectable } from '@angular/core';
import {Affiliate} from '../models/affiliate.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {affiliatesListQuery, affiliateQuery, deleteAffiliateMutation} from '../utils/query-builder';

@Injectable()
export class AffiliatesService extends AbstractEntityService<Affiliate> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Affiliate(data),
      affiliatesListQuery,
      affiliateQuery,
      deleteAffiliateMutation
    );
  }
}
