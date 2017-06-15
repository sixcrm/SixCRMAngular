import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {MdDialog, MdDialogRef} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Tracker} from '../../../../shared/models/tracker.model';
import {TrackersService} from '../../../../shared/services/trackers.service';
import {trackersByAffiliateListQuery, trackersListQuery} from '../../../../shared/utils/query-builder';
import {DeleteDialogComponent} from '../../../delete-dialog.component';
import {firstIndexOf} from '../../../../shared/utils/array-utils';
import {AssociateDialogComponent} from '../../../associate-dialog.component';
import {Affiliate} from '../../../../shared/models/affiliate.model';

@Component({
  selector: 'affiliate-trackers',
  templateUrl: './affiliate-trackers.component.html',
  styleUrls: ['./affiliate-trackers.component.scss']
})
export class AffiliateTrackersComponent extends AbstractEntityIndexComponent<Tracker> implements OnInit, OnDestroy {

  @Input() affiliate: Affiliate;

  associateDialogRef: MdDialogRef<AssociateDialogComponent<Tracker>>;

  constructor(
    trackersService: TrackersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService
  ) {
    super(trackersService, auth, dialog, progressBarService, paginationService);

    this.columnParams = [
      new ColumnParams('Name', (e: Tracker) => e.name),
      new ColumnParams('Type', (e: Tracker) => e.type),
      new ColumnParams('Event', (e: Tracker) => e.eventType.toString() || 'all'),
      new ColumnParams('Tracking Data', (e: Tracker) => e.body).setCode(true),
    ];
  }

  ngOnInit() {
    this.service.indexQuery = (limit?: number, cursor?: string) => trackersByAffiliateListQuery(this.affiliate.id, limit, cursor);
    this.takeUpdated = false;
    this.init();
  }

  ngOnDestroy() {
    this.service.indexQuery = trackersListQuery;
    this.destroy();
  }

  dissociate(tracker: Tracker): void {
    this.deleteDialogRef = this.deleteDialog.open(DeleteDialogComponent, { disableClose : true });
    this.deleteDialogRef.componentInstance.text = `Are you sure you want to dissociate ${tracker.name}?`;

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
        this.progressBarService.showTopProgressBar();
        this.service.entityUpdated$.take(1).subscribe(() => this.deleteEntityLocal(tracker));
        this.service.updateEntity(tracker);
      }
    }
  }

  showAddTracker(): void {
    this.service.planeCustomEntitiesQuery(trackersListQuery()).subscribe((trackers: Tracker[]) => {
      this.associateDialogRef = this.deleteDialog.open(AssociateDialogComponent);
      this.associateDialogRef.componentInstance.options = trackers.filter(tracker => firstIndexOf(this.entities, (el) => el.id === tracker.id) === -1);
      this.associateDialogRef.componentInstance.placeholder = 'Tracker';
      this.associateDialogRef.componentInstance.text = 'Select tracker to associate';
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
