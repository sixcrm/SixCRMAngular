import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Tracker} from '../../../../shared/models/tracker.model';
import {TrackersService} from '../../../../entity-services/services/trackers.service';
import {DeleteDialogComponent} from '../../../../dialog-modals/delete-dialog.component';
import {firstIndexOf} from '../../../../shared/utils/array.utils';
import {AssociateDialogComponent} from '../../../../dialog-modals/associate-dialog.component';
import {Affiliate} from '../../../../shared/models/affiliate.model';
import {
  trackersByAffiliateListQuery,
  trackersListQuery
} from '../../../../shared/utils/queries/entities/tracker.queries';
import {IndexQueryParameters} from '../../../../shared/utils/queries/index-query-parameters.model';
import {MatDialogRef, MatDialog} from '@angular/material';

@Component({
  selector: 'affiliate-trackers',
  templateUrl: './affiliate-trackers.component.html',
  styleUrls: ['./affiliate-trackers.component.scss']
})
export class AffiliateTrackersComponent extends AbstractEntityIndexComponent<Tracker> implements OnInit, OnDestroy {

  @Input() affiliate: Affiliate;

  associateDialogRef: any;

  constructor(
    trackersService: TrackersService,
    auth: AuthenticationService,
    dialog: MatDialog,
    paginationService: PaginationService
  ) {
    super(trackersService, auth, dialog, paginationService);

    this.columnParams = [
      new ColumnParams('AFFILIATE_TRACKING_NAME', (e: Tracker) => e.name),
      new ColumnParams('AFFILIATE_TRACKING_TYPE', (e: Tracker) => e.type),
      new ColumnParams('AFFILIATE_TRACKING_EVENT', (e: Tracker) => e.eventType.toString() || 'all'),
      new ColumnParams('AFFILIATE_TRACKING_DATA', (e: Tracker) => e.body).setCode(true),
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (params: IndexQueryParameters) => trackersByAffiliateListQuery(this.affiliate.id, params);
    this.takeUpdated = false;
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = trackersListQuery;
    this.destroy();
  }

  dissociate(tracker: Tracker): void {
    this.deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, { disableClose : true });
    this.deleteDialogRef.componentInstance.text = 'AFFILIATE_TRACKING_DISASSOCIATETEXT';

    this.deleteDialogRef.afterClosed().take(1).subscribe(result => {
      this.deleteDialogRef = null;
      this.handleRemoveTracker(result, tracker);
    });
  }

  handleRemoveTracker(result: any, tracker: Tracker): void {
    if (result.success) {
      let index = firstIndexOf(tracker.affiliates, (el) => el.id === this.affiliate.id);

      if (index >= 0) {
        tracker.affiliates.splice(index, 1);
        this.service.entityUpdated$.take(1).subscribe(() => this.deleteEntityLocal(tracker));
        this.service.updateEntity(tracker);
      }
    }
  }

  showAddTracker(): void {
    this.service.planeCustomEntitiesQuery(trackersListQuery({})).subscribe((trackers: Tracker[]) => {
      this.associateDialogRef = this.deleteDialog.open(AssociateDialogComponent);
      this.associateDialogRef.componentInstance.options = trackers.filter(tracker => firstIndexOf(this.entities, (el) => el.id === tracker.id) === -1);
      this.associateDialogRef.componentInstance.text = 'AFFILIATE_TRACKING_ASSOCIATETEXT';
      this.associateDialogRef.componentInstance.mapper = (el: Tracker) => el.name;

      this.associateDialogRef.afterClosed().take(1).subscribe(result => {
        this.associateDialogRef = null;
        this.handleAddTracker(result);
      });
    });
  }

  handleAddTracker(result: any): void {
    if (!result || !result.entity) return;

    let tracker: Tracker = result.entity;
    tracker.affiliates.push(this.affiliate);

    this.service.entityUpdated$.take(1).subscribe(() => {
      this.resetEntities();
      this.loadingData = true;
      this.service.getEntities(this.limit);
    });
    this.service.updateEntity(tracker);
  }
}
