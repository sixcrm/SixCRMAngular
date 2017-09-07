import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {
  fulfillmentProvidersListQuery,
  fulfillmentProviderQuery, deleteFulfillmentProviderMutation, createFulfillmentProviderMutation,
  updateFulfillmentProviderMutation
} from '../utils/queries/entities/fulfillment-provider.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class FulfillmentProvidersService extends AbstractEntityService<FulfillmentProvider> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new FulfillmentProvider(data),
      fulfillmentProvidersListQuery,
      fulfillmentProviderQuery,
      deleteFulfillmentProviderMutation,
      createFulfillmentProviderMutation,
      updateFulfillmentProviderMutation,
      'fulfillmentprovider',
      snackBar
    );
  }
}
