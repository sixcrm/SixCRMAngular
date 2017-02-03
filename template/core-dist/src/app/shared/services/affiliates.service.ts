import { Injectable } from '@angular/core';
import {Affiliate} from '../models/affiliate.model';
import {Subject} from 'rxjs';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {affiliatesListQuery, affiliateQuery} from '../utils/query-builder';

@Injectable()
export class AffiliatesService extends AbstractEntityService {
  affiliates$: Subject<Affiliate[]>;
  affiliate$: Subject<Affiliate>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);
    this.affiliates$ = new Subject<Affiliate[]>();
    this.affiliate$ = new Subject<Affiliate>();
  }

  getAffiliates() {
    this.queryRequest(affiliatesListQuery()).subscribe(
      (data) => {
        console.log(data);
        let affiliatesData = data.json().data.affiliatelist.affiliates;
        this.affiliates$.next(affiliatesData.map(affiliate => new Affiliate(affiliate)));
      },
      (error) => {
        console.error(error);
      }
    )
  }

  getAffiliate(id: string) {
    this.queryRequest(affiliateQuery(id)).subscribe(
      (data) => {
        let affiliateData = data.json().data.affiliate;
        this.affiliate$.next(new Affiliate(affiliateData));
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
