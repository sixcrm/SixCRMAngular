import {Injectable} from "@angular/core";
import {Campaign} from '../models/campaign.model';
import {Http} from "@angular/http";
import {campaignsInfoListQuery, campaignQuery, deleteCampaignMutation} from '../utils/query-builder';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';

@Injectable()
export class CampaignsService extends AbstractEntityService<Campaign> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Campaign(data),
      campaignsInfoListQuery,
      campaignQuery,
      deleteCampaignMutation,
      null,
      null,
      'campaign'
    );
  }
}
