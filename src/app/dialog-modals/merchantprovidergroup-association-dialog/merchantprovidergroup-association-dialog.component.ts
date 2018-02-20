import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {LoadBalancer} from '../../shared/models/load-balancer.model';
import {Campaign} from '../../shared/models/campaign.model';

@Component({
  selector: 'merchantprovidergroup-association-dialog',
  templateUrl: './merchantprovidergroup-association-dialog.component.html',
  styleUrls: ['./merchantprovidergroup-association-dialog.component.scss']
})
export class MerchantProviderGroupAssociationDialogComponent implements OnInit {

  merchantGroups: LoadBalancer[] = [];
  campaigns: Campaign[] = [];

  selectedGroup: LoadBalancer = new LoadBalancer();
  selectedCampaign: Campaign = new Campaign();

  groupMapper = (l: LoadBalancer) => l.name;
  campaignMapper = (c: Campaign) => c.name;

  error: boolean;

  constructor(public dialogRef: MdDialogRef<MerchantProviderGroupAssociationDialogComponent>) { }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close({});
  }

  add(): void {
    if (this.selectedCampaign && this.selectedCampaign.id && this.selectedGroup && this.selectedGroup.id) {
      this.dialogRef.close({group: this.selectedGroup, campaign: this.selectedCampaign});
    } else {
      this.error = true;
    }
  }
}
