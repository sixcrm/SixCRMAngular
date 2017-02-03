import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {CampaignsService} from "../../shared/services/campaigns.service";
import {Campaign} from '../../shared/models/campaign.model';
import {Router} from '@angular/router';

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {

  private campaignsSearchControl: FormControl = new FormControl();
  private searchString: string;
  private campaigns: Campaign[] = [];

  constructor(private campaignService: CampaignsService, private router: Router) { }

  ngOnInit() {
    this.campaignService.campaigns$.subscribe(campaigns => this.campaigns = campaigns );
    this.campaignService.getCampaigns();
  }

  search(): void {

  }

  viewCampaign(campaign: Campaign): void {
    this.router.navigateByUrl('/dashboard/campaigns/' + campaign.id);
  }

  editCampaign(campaign: Campaign): void {

  }

  deleteCampaign(campaign: Campaign): void {

  }
}
