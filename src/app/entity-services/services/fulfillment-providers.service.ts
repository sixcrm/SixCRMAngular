import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {FulfillmentProvider} from '../../shared/models/fulfillment-provider.model';
import {
  fulfillmentProvidersListQuery,
  fulfillmentProviderQuery, deleteFulfillmentProviderMutation, createFulfillmentProviderMutation,
  updateFulfillmentProviderMutation, validateFulfillmentProviderQuery, deleteFulfillmentProvidersMutation
} from '../../shared/utils/queries/entities/fulfillment-provider.queries';
import { extractData, HttpWrapperService } from '../../shared/services/http-wrapper.service';
import { CustomServerError } from '../../shared/models/errors/custom-server-error';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class FulfillmentProvidersService extends AbstractEntityService<FulfillmentProvider> {

  validationResponse$: Subject<any> = new Subject();

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
    super(
      http,
      authService,
      data => new FulfillmentProvider(data),
      fulfillmentProvidersListQuery,
      fulfillmentProviderQuery,
      deleteFulfillmentProviderMutation,
      deleteFulfillmentProvidersMutation,
      createFulfillmentProviderMutation,
      updateFulfillmentProviderMutation,
      null,
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

      const json = extractData(data).fulfillmentprovidervalidation;

      this.validationResponse$.next(json);
    });
  }

}
