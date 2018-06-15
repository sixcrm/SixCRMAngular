import {Injectable} from "@angular/core";
import {Campaign} from '../../shared/models/campaign.model';
import {AuthenticationService} from '../../authentication/authentication.service';
import {AbstractEntityService} from './abstract-entity.service';
import {
  campaignsInfoListQuery, campaignQuery,
  deleteCampaignMutation, createCampaignMutation, updateCampaignMutation, deleteCampaignsMutation
} from '../../shared/utils/queries/entities/campaign.queries';
import {HttpWrapperService} from '../../shared/services/http-wrapper.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class CampaignsService extends AbstractEntityService<Campaign> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MatSnackBar) {
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
      null,
      'campaign',
      snackBar
    );
  }
}
