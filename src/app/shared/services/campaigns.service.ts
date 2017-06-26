import {Injectable} from "@angular/core";
import {Campaign} from '../models/campaign.model';
import {Http} from "@angular/http";
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  campaignsInfoListQuery, campaignQuery,
  deleteCampaignMutation, createCampaignMutation, updateCampaignMutation
} from '../utils/queries/entities/campaign.queries';

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
      createCampaignMutation,
      updateCampaignMutation,
      'campaign'
    );
  }
}
