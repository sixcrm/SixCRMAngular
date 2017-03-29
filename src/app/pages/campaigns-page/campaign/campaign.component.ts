import { Component, OnInit } from '@angular/core';
import {AbstractEntityComponent} from '../../abstract-entity-component';
import {Campaign} from '../../../shared/models/campaign.model';
import {CampaignsService} from '../../../shared/services/campaigns.service';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent extends AbstractEntityComponent<Campaign> implements OnInit {

  constructor(service: CampaignsService, progressBarService: ProgressBarService) {
    super(service, progressBarService);
  }

  ngOnInit() {
    this.init();
  }

}
