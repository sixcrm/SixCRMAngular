import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Affiliate} from '../../../../shared/models/affiliate.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';

@Component({
  selector: 'tracker-affiliates',
  templateUrl: './tracker-affiliates.component.html',
  styleUrls: ['./tracker-affiliates.component.scss']
})
export class TrackerAffiliatesComponent implements OnInit {

  @Input() affiliates: Affiliate[] = [];
  @Output() removeAffiliate: EventEmitter<Affiliate> = new EventEmitter();

  entities: Affiliate[] = [];

  columnParams: ColumnParams<Affiliate>[] = [];
  sortedColumnParams: ColumnParams<Affiliate> = new ColumnParams();

  limit: number = 10;
  page: number = 0;
  hasMore: boolean;
  paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    let f = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Name', (e: Affiliate) => e.name),
      new ColumnParams('Affiliate ID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('Created At', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated At', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];

    this.reshuffle();
  }

  updateLimit(limit: number) {
    this.limit = limit;
  }

  nextPage() {
    this.page++;
  }

  previousPage() {
    this.page++;
  }

  hasMorePages() {
    return this.entities.length > this.page * this.limit + this.limit;
  }

  reshuffle() {
    this.entities = this.affiliates.slice(this.page * this.limit, this.page * this.limit + this.limit);
  }
}
