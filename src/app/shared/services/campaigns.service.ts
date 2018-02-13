import {Injectable} from "@angular/core";
import {Campaign} from '../models/campaign.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  campaignsInfoListQuery, campaignQuery,
  deleteCampaignMutation, createCampaignMutation, updateCampaignMutation, deleteCampaignsMutation
} from '../utils/queries/entities/campaign.queries';
import {HttpWrapperService} from './http-wrapper.service';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class CampaignsService extends AbstractEntityService<Campaign> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Campaign(data),
      campaignsInfoListQuery,
      campaignQuery,
      deleteCampaignMutation,
      deleteCampaignsMutation,
      createCampaignMutation,
      updateCampaignMutation,
      'campaign',
      snackBar
    );
  }
}
