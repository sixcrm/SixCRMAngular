import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {CampaignsService} from "../../shared/services/campaigns.service";

@Component({
  selector: 'campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {

  private campaignsSearchControl: FormControl = new FormControl();
  private searchString: string;
  private campaigns: any[] = [];
  private campaignsSuggestions: string[] = [];

  constructor(private campaignService: CampaignsService) { }

  ngOnInit() {
    this.campaignService.campaigns$.subscribe(campaigns => this.campaigns = campaigns);
    this.campaignService.campaignsSuggestions$.subscribe(campaignsSuggestions => this.campaignsSuggestions = campaignsSuggestions);
    this.campaignService.getCampaigns('');

    this.campaignsSearchControl
      .valueChanges
      .debounceTime(200)
      .subscribe(search => {
        this.campaignService.getCampaignsSuggestions(search);
      });
  }

  search(): void {
    this.campaignService.getCampaigns(this.searchString);
    this.campaignsSuggestions = [];
  }

  editCampaignModal(campaign: any) {
    console.log('open edit modal for', campaign.name);
  }

  deleteCampaign(campaign: any) {
    console.log('deleting campaign', campaign.name);
  }
}
