import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {AbstractEntityIndexComponent} from '../../../abstract-entity-index.component';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {ProgressBarService} from '../../../../shared/services/progress-bar.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../../shared/services/pagination.service';
import {ColumnParams} from '../../../../shared/models/column-params.model';
import {Tracker} from '../../../../shared/models/tracker.model';
import {TrackersService} from '../../../../shared/services/trackers.service';

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

    let tz = this.authService.getTimezone();

    this.columnParams = [
      new ColumnParams('Type', (e: Tracker) => e.type),
      new ColumnParams('Event', (e: Tracker) => e.eventType.toString() || 'all'),
      new ColumnParams('Created at', (e: Tracker) => e.createdAt.tz(tz).format('MM/DD/YYYY')),
      new ColumnParams('Updated at', (e: Tracker) => e.updateAt.tz(tz).format('MM/DD/YYYY')),
      new ColumnParams('Tracking Data', (e: Tracker) => e.body).setCode(true),
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
