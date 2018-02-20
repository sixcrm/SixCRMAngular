import {Injectable} from "@angular/core";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import {MerchantProviderGroupAssociation} from '../models/merchant-provider-group-association.model';
import {
  merchantProviderGroupAssociationsListQuery,
  merchantProviderGroupAssociationQuery, createMerchantProviderGroupAssociationMutation, deleteMerchantProviderGroupAssociationMutation,
  deleteMerchantProviderGroupAssociationssMutation
} from '../utils/queries/entities/merchant-provider-group-associations.queries';

@Injectable()
export class MerchantProviderGroupAssociationsService extends AbstractEntityService<MerchantProviderGroupAssociation> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new MerchantProviderGroupAssociation(data),
      merchantProviderGroupAssociationsListQuery,
      merchantProviderGroupAssociationQuery,
      deleteMerchantProviderGroupAssociationMutation,
      deleteMerchantProviderGroupAssociationssMutation,
      createMerchantProviderGroupAssociationMutation,
      null,
      'merchantprovidergroupassociation',
      snackBar
    );
  }
}
