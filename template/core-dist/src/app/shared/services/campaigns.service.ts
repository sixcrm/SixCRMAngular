import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class CampaignsService {

  campaigns$: Subject<any[]>;
  campaignsSuggestions$: Subject<string[]>;

  private campaignsHolder = [
    {name: 'first name', itemName: 'first item name', itemPrice: 'first item price'},
    {name: 'second name', itemName: 'second item name', itemPrice: 'second item price'},
    {name: 'third name', itemName: 'third item name', itemPrice: 'third item price'},
    {name: 'fourth name', itemName: 'fourth item name', itemPrice: 'fourth item price'},
  ];

  constructor() {
    this.campaigns$ = new Subject();
    this.campaignsSuggestions$ = new Subject();
  }

  getCampaigns(searchString: string): void {
    if (!searchString) {
      this.campaigns$.next(this.campaignsHolder);
    } else {
      let queriedHolders = this.campaignsHolder.filter(campaign => campaign.name.includes(searchString));
      this.campaigns$.next(queriedHolders);
    }
  }

  getCampaignsSuggestions(searchString: string): void {
    if (!searchString) {
      this.campaignsSuggestions$.next([]);
    } else {
      let queriedHolders = this.campaignsHolder.filter(campaign => campaign.name.includes(searchString)).map(campaign => campaign.name);
      this.campaignsSuggestions$.next(queriedHolders);
    }
  }
}
