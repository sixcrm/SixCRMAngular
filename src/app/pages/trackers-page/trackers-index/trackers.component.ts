import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
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
    paginationService: PaginationService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    super(trackersService, auth, dialog, paginationService, router, activatedRoute);

    this.entityFactory = () => new Tracker();

    let f = this.authService.getTimezone();
    this.columnParams = [
      new ColumnParams('TRACKER_INDEX_HEADER_ID', (e: Tracker) => e.id).setSelected(false),
      new ColumnParams('TRACKER_INDEX_HEADER_NAME', (e: Tracker) => e.name),
      new ColumnParams('TRACKER_INDEX_HEADER_TYPE', (e: Tracker) => e.type),
      new ColumnParams('TRACKER_INDEX_HEADER_EVENT', (e: Tracker) => e.eventType.toString() || 'all'),
      new ColumnParams('TRACKER_INDEX_HEADER_DATA', (e: Tracker) => e.body).setCode(true),
      new ColumnParams('TRACKER_INDEX_HEADER_CREATED', (e: Tracker) => e.createdAt.tz(f).format('MM/DD/YYYY')).setSelected(false),
      new ColumnParams('TRACKER_INDEX_HEADER_UPDATED', (e: Tracker) => e.updatedAt.tz(f).format('MM/DD/YYYY')).setSelected(false)
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
