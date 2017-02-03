import { Injectable } from '@angular/core';
import {MerchantProvider} from '../models/merchant-provider.model';
import {Subject} from 'rxjs';
import {Http} from '@angular/http';
import {marchantProvidersListQuery, marchantProviderQuery} from '../utils/query-builder';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';

@Injectable()
export class MerchantProvidersService extends AbstractEntityService {
  merchantProviders$: Subject<MerchantProvider[]>;
  merchantProvider$: Subject<MerchantProvider>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);
    this.merchantProviders$ = new Subject<MerchantProvider[]>();
    this.merchantProvider$ = new Subject<MerchantProvider>();
  }

  getMerchantProviders(): void {
    this.queryRequest(marchantProvidersListQuery()).subscribe(
      (data) => {
        let merchantProvidersData = data.json().data.merchantproviderlist.merchantproviders;
        this.merchantProviders$.next(merchantProvidersData.map(merchantProvider => new MerchantProvider(merchantProvider)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getMerchantProvider(id: string): void {
    this.queryRequest(marchantProviderQuery(id)).subscribe(
      (data) => {
        let merchantProviderData = data.json().data.merchantprovider;
        this.merchantProvider$.next(new MerchantProvider(merchantProviderData));
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
