import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Campaign} from '../../../shared/models/campaign.model';
import {CampaignsService} from '../../../shared/services/campaigns.service';

@Component({
  selector: 'c-campaign-view',
  templateUrl: './campaign-view.component.html',
  styleUrls: ['./campaign-view.component.scss']
})
export class CampaignViewComponent implements OnInit {

  private campaign: Campaign;

  constructor(private campaignsService: CampaignsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.campaignsService.campaign$.subscribe((campaign: Campaign) => {
      this.campaign = campaign;
    });
    this.route.params.subscribe((params: Params) => {
      this.campaignsService.getCampaign(params['id']);
    });
  }
}
