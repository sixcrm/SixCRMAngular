import { Component, OnInit } from '@angular/core';
import {CampaignsService} from '../../../shared/services/campaigns.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {Campaign} from '../../../shared/models/campaign.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';

@Component({
  selector: 'campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent extends AbstractEntityViewComponent<Campaign> implements OnInit {

  constructor(service: CampaignsService, route: ActivatedRoute, progressBar: ProgressBarService) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init();
  }

}
