import {Component, OnInit, Input} from '@angular/core';
import {CampaignStats} from '../../../shared/models/campaign-stats.model';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'top-campaigns',
  templateUrl: './top-campaigns.component.html',
  styleUrls: ['./top-campaigns.component.scss']
})
export class TopCampaignsComponent implements OnInit {

  @Input() campaigns: CampaignStats[];

  columnParams: ColumnParams<CampaignStats>[] = [
    new ColumnParams('Campaign', (c: CampaignStats) => c.campaign),
    new ColumnParams('Amount', (c: CampaignStats) => c.amount)
  ];
  sortParams: ColumnParams<CampaignStats> = new ColumnParams();
  sortOrder: string = 'asc';

  constructor() { }

  ngOnInit() {
  }

  sort(params: ColumnParams<CampaignStats>): void {
    if (this.sortParams.label === params.label) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortParams = params;
      this.sortOrder = 'asc';
    }
  }

}
