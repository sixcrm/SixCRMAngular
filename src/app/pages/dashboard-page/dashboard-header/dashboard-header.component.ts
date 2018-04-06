import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Campaign} from '../../../shared/models/campaign.model';
import {DashboardQuery, DashboardTimeFilter} from '../dashboard.exports';
import {TranslatedQuote} from "../../../translation/translated-quote.model";

@Component({
  selector: 'dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

  @Input() campaigns: Campaign[] = [];
  @Input() selectedCampaign: Campaign;
  @Input() queries: DashboardQuery[] = [];
  @Input() selectedQuery: DashboardQuery;
  @Input() timeFilters: DashboardTimeFilter[] = [];
  @Input() quote: TranslatedQuote;

  @Output() campaignSelected: EventEmitter<Campaign> = new EventEmitter();
  @Output() querySelected: EventEmitter<DashboardQuery> = new EventEmitter();
  @Output() timeFilterSelected: EventEmitter<DashboardTimeFilter> = new EventEmitter();

  campaignMapper = (c: Campaign) => c.name;
  campaignSelectedMapper = (c: Campaign) => c === this.selectedCampaign;

  queryMapper = (q: DashboardQuery) => q.label;
  querySelectedMapper = (q: DashboardQuery) => q.selected;


  constructor() { }

  ngOnInit() {
  }

}
