import {Injectable} from "@angular/core";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {MerchantProviderGroupAssociation} from '../../shared/models/merchant-provider-group-association.model';
import {
  merchantProviderGroupAssociationsListQuery,
  merchantProviderGroupAssociationQuery, createMerchantProviderGroupAssociationMutation, deleteMerchantProviderGroupAssociationMutation,
  deleteMerchantProviderGroupAssociationssMutation
} from '../../shared/utils/queries/entities/merchant-provider-group-associations.queries';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class MerchantProviderGroupAssociationsService extends AbstractEntityService<MerchantProviderGroupAssociation> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
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
      null,
      'merchantprovidergroupassociation',
      snackBar
    );
  }
}
