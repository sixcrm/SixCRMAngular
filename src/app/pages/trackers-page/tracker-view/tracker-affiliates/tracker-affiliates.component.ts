import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Affiliate} from '../../../../shared/models/affiliate.model';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {AffiliatesService} from '../../../../shared/services/affiliates.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import {AssociateDialogComponent} from '../../../associate-dialog.component';
import {firstIndexOf} from '../../../../shared/utils/array-utils';

@Component({
  selector: 'tracker-affiliates',
  templateUrl: './tracker-affiliates.component.html',
  styleUrls: ['./tracker-affiliates.component.scss']
})
export class TrackerAffiliatesComponent implements OnInit {

  @Input() set affiliates(affiliates: Affiliate[]) {
    this.entitiesHolder = affiliates;
    this.reshuffle();
  };

  @Output() removeAffiliate: EventEmitter<Affiliate> = new EventEmitter();
  @Output() associateAffiliate: EventEmitter<Affiliate> = new EventEmitter();

  entitiesHolder: Affiliate[] = [];
  entities: Affiliate[] = [];

  columnParams: ColumnParams<Affiliate>[] = [];
  sortedColumnParams: ColumnParams<Affiliate> = new ColumnParams();

  limit: number = 10;
  page: number = 0;
  paginationValues: number[] = [5, 10, 15, 20, 30, 40, 50];
  filterValue: string = '';

  associateDialogRef: MdDialogRef<AssociateDialogComponent<Affiliate>>;

  constructor(
    private authService: AuthenticationService,
    private affiliateService: AffiliatesService,
    private associateDialog: MdDialog
  ) { }

  ngOnInit() {
    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('Name', (e: Affiliate) => e.name),
      new ColumnParams('Affiliate ID', (e: Affiliate) => e.affiliateId),
      new ColumnParams('Created At', (e: Affiliate) => e.createdAt.tz(f).format('MM/DD/YYYY')),
      new ColumnParams('Updated At', (e: Affiliate) => e.updatedAt.tz(f).format('MM/DD/YYYY'))
    ];
  }

  updateLimit(limit: number): void {
    this.limit = limit;
  }

  next(): void {
    this.page++;
  }

  previous(): void {
    this.page++;
  }

  hasMorePages(): boolean {
    return this.entities.length > this.page * this.limit + this.limit;
  }

  reshuffle(): void {
    this.entities = this.entitiesHolder.slice(this.page * this.limit, this.page * this.limit + this.limit);
  }

  showAddAffiliate(): void {
    this.affiliateService.entities$.take(1).subscribe((affiliates: Affiliate[]) => {
      this.associateDialogRef = this.associateDialog.open(AssociateDialogComponent);
      this.associateDialogRef.componentInstance.options = affiliates.filter(affiliate => firstIndexOf(this.entities, (el) => el.id === affiliate.id) === -1);
      this.associateDialogRef.componentInstance.placeholder = 'Affiliate';
      this.associateDialogRef.componentInstance.text = 'Select affiliate to associate';
      this.associateDialogRef.componentInstance.mapper = (el: Affiliate) => el.name;

      this.associateDialogRef.afterClosed().take(1).subscribe(result => {
        this.associateDialogRef = null;
        if (result && result.entity) {
          this.associateAffiliate.emit(result.entity);
        }
      });
    });
    this.affiliateService.getEntities();
  }
}
