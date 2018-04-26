import { Injectable } from '@angular/core';
import {MerchantProvider} from '../models/merchant-provider/merchant-provider.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  merchantProvidersListQuery, merchantProviderQuery,
  deleteMerchantProviderMutation, createMerchantProviderMutation, updateMerchantProviderMutation,
  deleteMerchantProvidersMutation
} from '../utils/queries/entities/merchant-provider.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class MerchantProvidersService extends AbstractEntityService<MerchantProvider> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new MerchantProvider(data),
      merchantProvidersListQuery,
      merchantProviderQuery,
      deleteMerchantProviderMutation,
      deleteMerchantProvidersMutation,
      createMerchantProviderMutation,
      updateMerchantProviderMutation,
      null,
      'merchantprovider',
      snackBar
    );
  }
}
