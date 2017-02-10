import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Campaign} from '../../../shared/models/campaign.model';
import {CampaignsService} from '../../../shared/services/campaigns.service';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';

@Component({
  selector: 'c-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent extends AbstractEntityViewComponent<Campaign> implements OnInit {

  private campaign: Campaign;

  constructor(private campaignsService: CampaignsService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(campaignsService, route, progressBarService);
  }

  ngOnInit() {
    this.campaignsService.entity$.subscribe((campaign: Campaign) => {
      this.campaign = campaign;
      this.progressBarService.hideTopProgressBar();
    });
    this.campaignsService.entityDeleted$.subscribe((data) => this.campaignsService.getEntities());

    this.init();
  }
}
