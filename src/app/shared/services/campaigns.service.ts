import {Injectable} from "@angular/core";
import {Campaign} from '../models/campaign.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  campaignsInfoListQuery, campaignQuery,
  deleteCampaignMutation, createCampaignMutation, updateCampaignMutation
} from '../utils/queries/entities/campaign.queries';
import {HttpWrapperService} from './http-wrapper.service';

@Injectable()
export class CampaignsService extends AbstractEntityService<Campaign> {

  constructor(http: HttpWrapperService, authService: AuthenticationService) {
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
