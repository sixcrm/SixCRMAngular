import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Tracker} from '../../../../shared/models/tracker.model';
import {TrackersService} from '../../../../shared/services/trackers.service';
import {trackersByAffiliateListQuery, trackersListQuery} from '../../../../shared/utils/query-builder';
import {DeleteDialogComponent} from '../../../delete-dialog.component';
import {firstIndexOf} from '../../../../shared/utils/array-utils';

@Component({
  selector: 'affiliate-trackers',
  templateUrl: './affiliate-trackers.component.html',
  styleUrls: ['./affiliate-trackers.component.scss']
})
export class AffiliateTrackersComponent extends AbstractEntityIndexComponent<Tracker> implements OnInit, OnDestroy {

  @Input() affiliateId: string;

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
    this.service.indexQuery = (limit?: number, cursor?: string) => trackersByAffiliateListQuery(this.affiliateId, limit, cursor);
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
      if (result.success) {
        let index = firstIndexOf(tracker.affiliates, (el) => el.id === this.affiliateId);

        if (index >= 0) {
          tracker.affiliates.splice(index, 1);
          this.progressBarService.showTopProgressBar();
          this.service.entityUpdated$.take(1).subscribe(() => this.deleteEntityLocal(tracker));
          this.service.updateEntity(tracker);
        }
      }
    });
  }
}
