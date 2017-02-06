import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subject} from 'rxjs';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {
  fulfillmentProvidersListQuery, fulfillmentProviderQuery,
  deleteFulfillmentProviderMutation
} from '../utils/query-builder';

@Injectable()
export class FulfillmentProvidersService extends AbstractEntityService {
  fulfillmentProviders$: Subject<FulfillmentProvider[]>;
  fulfillmentProvider$: Subject<FulfillmentProvider>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);
    this.fulfillmentProviders$ = new Subject<FulfillmentProvider[]>();
    this.fulfillmentProvider$ = new Subject<FulfillmentProvider>();
  }

  getFulfillmentProviders() {
    this.queryRequest(fulfillmentProvidersListQuery()).subscribe(
      (data) => {
        let providersData = data.json().data.fulfillmentproviderlist.fulfillmentproviders;
        this.fulfillmentProviders$.next(providersData.map(provider => new FulfillmentProvider(provider)));
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getFulfillmentProvider(id: string) {
    this.queryRequest(fulfillmentProviderQuery(id)).subscribe(
      (data) => {
        let fulfillmentProviderData = data.json().data.fulfillmentprovider;
        this.fulfillmentProvider$.next(new FulfillmentProvider(fulfillmentProviderData));
      },
      (error) => {
        console.error(error);
      }
    )
  }

  deleteEntity(id: string): void {
    this.queryRequest(deleteFulfillmentProviderMutation(id)).subscribe(
      (success) => this.getFulfillmentProviders(),
      (error) => console.error(error)
    );
  }

  editEntity(entity: FulfillmentProvider): void {
  }
}
