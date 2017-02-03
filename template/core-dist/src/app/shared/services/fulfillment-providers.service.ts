import { Injectable } from '@angular/core';
import {AbstractEntityService} from './abstract-entity.service';
import {Http} from '@angular/http';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Subject} from 'rxjs';
import {FulfillmentProvider} from '../models/fulfillment-provider.model';
import {environment} from '../../../environments/environment';
import {fulfillmentProvidersListQuery, fulfillmentProviderQuery} from '../utils/query-builder';

@Injectable()
export class FulfillmentProvidersService extends AbstractEntityService {
  fulfillmentProviders$: Subject<FulfillmentProvider[]>;
  fulfillmentProvider$: Subject<FulfillmentProvider>;

  constructor(private http: Http, authService: AuthenticationService) {
    super(authService);
    this.fulfillmentProviders$ = new Subject<FulfillmentProvider[]>();
    this.fulfillmentProvider$ = new Subject<FulfillmentProvider>();
  }

  getFulfillmentProviders() {
    this.http.post(environment.endpoint, fulfillmentProvidersListQuery(), { headers: this.generateHeaders() })
      .subscribe(
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
    this.http.post(environment.endpoint, fulfillmentProviderQuery(id), { headers: this.generateHeaders() })
      .subscribe(
        (data) => {
          let fulfillmentProviderData = data.json().data.fulfillmentprovider;
          this.fulfillmentProvider$.next(new FulfillmentProvider(fulfillmentProviderData));
        },
        (error) => {
          console.error(error);
        }
      )
  }

}
