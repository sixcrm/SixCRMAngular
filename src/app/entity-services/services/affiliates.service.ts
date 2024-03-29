import { Injectable } from '@angular/core';
import {Affiliate} from '../../shared/models/affiliate.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {
  affiliatesListQuery, affiliateQuery,
  deleteAffiliateMutation, createAffiliateMutation, updateAffiliateMutation, deleteAffiliatesMutation
} from '../../shared/utils/queries/entities/affiliate.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AffiliatesService extends AbstractEntityService<Affiliate> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new Affiliate(data),
      affiliatesListQuery,
      affiliateQuery,
      deleteAffiliateMutation,
      deleteAffiliatesMutation,
      createAffiliateMutation,
      updateAffiliateMutation,
      null,
      'affiliate',
      snackBar
    );
  }
}
