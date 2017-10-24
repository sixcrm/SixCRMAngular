import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {
  fulfillmentProvidersListQuery,
  fulfillmentProviderQuery, deleteFulfillmentProviderMutation, createFulfillmentProviderMutation,
  updateFulfillmentProviderMutation, validateFulfillmentProviderQuery
} from '../utils/queries/entities/fulfillment-provider.queries';
import { extractData, HttpWrapperService } from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';
import { CustomServerError } from '../models/errors/custom-server-error';
import {Subject} from 'rxjs';

@Injectable()
export class FulfillmentProvidersService extends AbstractEntityService<FulfillmentProvider> {

  validationResponse$: Subject<any> = new Subject();

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

  validateFulfillmentProvider(fulfillmentProvider: FulfillmentProvider): void {
    if (!this.hasWritePermission()) {
      return;
    }
    this.queryRequest(validateFulfillmentProviderQuery(fulfillmentProvider)).subscribe(data => {
      if (data instanceof CustomServerError) {
        return;
      }

      const json = extractData(data).fulfillmentprovidervalidation.response;

      this.validationResponse$.next(json);
    });
  }

}
