import { Injectable } from '@angular/core';
import {MerchantProvider} from '../models/merchant-provider/merchant-provider.model';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  merchantProvidersListQuery, merchantProviderQuery,
  deleteMerchantProviderMutation, createMerchantProviderMutation, updateMerchantProviderMutation
} from '../utils/queries/entities/merchant-provider.queries';

@Injectable()
export class MerchantProvidersService extends AbstractEntityService<MerchantProvider> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new MerchantProvider(data),
      merchantProvidersListQuery,
      merchantProviderQuery,
      deleteMerchantProviderMutation,
      createMerchantProviderMutation,
      updateMerchantProviderMutation,
      'merchantprovider'
    );
  }
}
