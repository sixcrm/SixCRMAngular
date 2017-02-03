import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Campaign} from '../models/campaign.model';
import {Http} from "@angular/http";
import {campaignsInfoListQuery, campaignQuery} from '../utils/query-builder';
import {environment} from '../../../environments/environment';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';

@Injectable()
export class CampaignsService extends AbstractEntityService {

  campaigns$: Subject<Campaign[]>;
  campaign$: Subject<Campaign>;
  campaignsSuggestions$: Subject<string[]>;

  constructor(http: Http, authService: AuthenticationService) {
    super(http, authService);
    this.campaigns$ = new Subject<Campaign[]>();
    this.campaign$ = new Subject<Campaign>();
    this.campaignsSuggestions$ = new Subject<string[]>();
  }

  getCampaigns(): void {
    this.queryRequest(campaignsInfoListQuery()).subscribe(
      (data) => {
        let campaignData = data.json().data.campaignlist.campaigns;
        this.campaigns$.next(campaignData.map(campaign => new Campaign(campaign)));
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getCampaign(id: string): void {
    this.queryRequest(campaignQuery(id)).subscribe(
      (data) => {
        let campaignData = data.json().data.campaign;
        this.campaign$.next(new Campaign(campaignData));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
