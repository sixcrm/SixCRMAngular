import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {ProgressBarService} from '../../../shared/services/progress-bar.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';

@Component({
  selector: 'trackers',
  templateUrl: './trackers.component.html',
  styleUrls: ['./trackers.component.scss']
})
export class TrackersComponent extends AbstractEntityIndexComponent<Tracker> implements OnInit, OnDestroy {

  constructor(
    trackersService: TrackersService,
    auth: AuthenticationService,
    dialog: MdDialog,
    progressBarService: ProgressBarService,
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(trackersService, auth, dialog, progressBarService, paginationService, router, activatedRoute);

    let tz = auth.getTimezone();

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
