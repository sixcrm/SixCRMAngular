import { Component, OnInit } from '@angular/core';
import {CampaignsService} from "../../shared/services/campaigns.service";
import {Campaign} from '../../shared/models/campaign.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../shared/services/progress-bar.service';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends AbstractEntityIndexComponent<Campaign> implements OnInit {
  private campaigns: Campaign[] = [];

  constructor(
    private campaignService: CampaignsService,
    router: Router,
    route: ActivatedRoute,
    dialog: MdDialog,
    progressBarService: ProgressBarService
  ) {
    super(campaignService, router, route, dialog, progressBarService);
  }

  ngOnInit() {
    this.campaignService.entities$.subscribe(campaigns => {
      this.campaigns = campaigns;
      this.progressBarService.hideTopProgressBar();
    });
    this.campaignService.entityDeleted$.subscribe((data) => this.campaignService.getEntities());

    this.init();
  }
}
