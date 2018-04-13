import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {MerchantProviderGroup} from '../models/merchant-provider-group.model';
import {
  merchantProviderGroupsInfoListQuery, merchantProviderGroupQuery,
  deleteMerchantProviderGroupMutation, createMerchantProviderGroupMutation, updateMerchantProviderGroupMutation, deleteMerchantProviderGroupsMutation
} from '../utils/queries/entities/merchant-provider-group.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class MerchantProviderGroupsService extends AbstractEntityService<MerchantProviderGroup> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new MerchantProviderGroup(data),
      merchantProviderGroupsInfoListQuery,
      merchantProviderGroupQuery,
      deleteMerchantProviderGroupMutation,
      deleteMerchantProviderGroupsMutation,
      createMerchantProviderGroupMutation,
      updateMerchantProviderGroupMutation,
      'merchantprovidergroup',
      snackBar
    );
  }
}
