import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {
  fulfillmentProvidersListQuery, fulfillmentProviderQuery,
  deleteFulfillmentProviderMutation, createFulfillmentProviderMutation, updateFulfillmentProviderMutation
} from '../utils/query-builder';

@Injectable()
export class FulfillmentProvidersService extends AbstractEntityService<FulfillmentProvider> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new FulfillmentProvider(data),
      fulfillmentProvidersListQuery,
      fulfillmentProviderQuery,
      deleteFulfillmentProviderMutation,
      createFulfillmentProviderMutation,
      updateFulfillmentProviderMutation
    );
  }
}
