import { Component, OnInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import {MerchantProviderGroup} from '../../shared/models/merchant-provider-group.model';
import {Campaign} from '../../shared/models/campaign.model';

@Component({
  selector: 'merchantprovidergroup-association-dialog',
  templateUrl: './merchantprovidergroup-association-dialog.component.html',
  styleUrls: ['./merchantprovidergroup-association-dialog.component.scss']
})
export class MerchantProviderGroupAssociationDialogComponent implements OnInit {

  merchantGroups: MerchantProviderGroup[] = [];
  campaigns: Campaign[] = [];

  selectedGroup: MerchantProviderGroup = new MerchantProviderGroup();
  selectedCampaign: Campaign = new Campaign();

  groupMapper = (l: MerchantProviderGroup) => l.name;
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
