import {Component, OnInit, Input} from '@angular/core';
import {CampaignDelta} from '../../../shared/models/campaign-delta.model';

@Component({
  selector: 'movers-card',
  templateUrl: './movers-card.component.html',
  styleUrls: ['./movers-card.component.scss']
})
export class MoversCardComponent implements OnInit {
  campaignDelta: CampaignDelta[] = [];
  height: string = '0';

  @Input() set campaigns(data: CampaignDelta[]) {
    if (data) {
      if (data.length > 5) {
        this.campaignDelta = data.slice(0,5);
      } else {
        this.campaignDelta = data;
      }

      this.height = this.campaignDelta.length * 66 + 'px';
    }
  }

  constructor() { }

  ngOnInit() { }

  isDecing(campaign: CampaignDelta): boolean {
    return campaign.percentageChangeAmount.indexOf('-') === 0;
  }
}
