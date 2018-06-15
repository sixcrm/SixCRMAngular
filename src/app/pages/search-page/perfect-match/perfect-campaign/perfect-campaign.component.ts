import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {Campaign} from '../../../../shared/models/campaign.model';
import {CampaignsService} from '../../../../entity-services/services/campaigns.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'perfect-campaign',
  templateUrl: './perfect-campaign.component.html',
  styleUrls: ['./perfect-campaign.component.scss']
})
export class PerfectCampaignComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  campaign: Campaign;

  constructor(private campaignsService: CampaignsService) {
    super();
  }

  ngOnInit() {
    this.campaignsService.entity$.takeUntil(this.unsubscribe$).subscribe(campaign => {
      if (campaign instanceof CustomServerError) {
        this.serverError = campaign;
        return;
      }

      this.serverError = null;
      this.campaign = campaign
    });

    this.campaignsService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
