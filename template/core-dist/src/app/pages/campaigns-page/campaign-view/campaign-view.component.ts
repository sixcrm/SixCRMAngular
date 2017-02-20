import {Component, OnInit, OnDestroy} from '@angular/core';
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
export class CampaignViewComponent extends AbstractEntityViewComponent<Campaign> implements OnInit, OnDestroy {

  constructor(private campaignsService: CampaignsService, route: ActivatedRoute, progressBarService: ProgressBarService) {
    super(campaignsService, route, progressBarService);
  }

  ngOnInit() {
    if (this.addMode) {
      this.entity = new Campaign();
    }

    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
