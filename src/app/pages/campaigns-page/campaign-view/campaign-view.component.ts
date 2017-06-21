import { Component, OnInit } from '@angular/core';
import {CampaignsService} from '../../../shared/services/campaigns.service';
import {ActivatedRoute} from '@angular/router';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {Campaign} from '../../../shared/models/campaign.model';
import {AbstractEntityViewComponent} from '../../abstract-entity-view.component';
import {NavigationService} from '../../../navigation/navigation.service';

@Component({
  selector: 'campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent extends AbstractEntityViewComponent<Campaign> implements OnInit {

  selectedIndex: number = 0;

  constructor(
    service: CampaignsService,
    route: ActivatedRoute,
    progressBar: ProgressBarService,
    public navigation: NavigationService
  ) {
    super(service, route, progressBar);
  }

  ngOnInit() {
    super.init(() => this.navigation.goToNotFoundPage());

    if (this.addMode) {
      this.entity = new Campaign();
      this.entityBackup = this.entity.copy();
    }
  }

  setIndex(value: number): void {
    this.selectedIndex = value;
  }
}
