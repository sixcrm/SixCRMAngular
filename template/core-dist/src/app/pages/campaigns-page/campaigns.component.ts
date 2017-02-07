import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {CampaignsService} from "../../shared/services/campaigns.service";
import {Campaign} from '../../shared/models/campaign.model';
import {Router, ActivatedRoute} from '@angular/router';
import {AbstractEntityIndexComponent} from '../abstract-entity-index.component';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent extends AbstractEntityIndexComponent implements OnInit {
  private campaigns: Campaign[] = [];

  constructor(private campaignService: CampaignsService, router: Router, route: ActivatedRoute) {
    super(campaignService, router, route);
  }

  ngOnInit() {
    this.campaignService.entities$.subscribe(campaigns => this.campaigns = campaigns );
    this.campaignService.getEntities();
  }

  search(): void {

  }
}
