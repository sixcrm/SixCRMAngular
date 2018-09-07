import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DashboardQuery, DashboardTimeFilter} from '../dashboard.exports';

@Component({
  selector: 'dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.scss']
})
export class DashboardHeaderComponent implements OnInit {

  @Input() queries: DashboardQuery[] = [];
  @Input() selectedQuery: DashboardQuery;
  @Input() timeFilters: DashboardTimeFilter[] = [];

  @Output() querySelected: EventEmitter<DashboardQuery> = new EventEmitter();
  @Output() timeFilterSelected: EventEmitter<DashboardTimeFilter> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
