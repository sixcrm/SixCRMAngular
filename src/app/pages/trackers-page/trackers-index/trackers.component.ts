import {Component, OnInit, OnDestroy} from '@angular/core';
import {Tracker} from '../../../shared/models/tracker.model';
import {AbstractEntityIndexComponent} from '../../abstract-entity-index.component';
import {TrackersService} from '../../../shared/services/trackers.service';
import {AuthenticationService} from '../../../authentication/authentication.service';
import {MdDialog} from '@angular/material';
import {PaginationService} from '../../../shared/services/pagination.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ColumnParams} from '../../../shared/models/column-params.model';
import {UserSettingsService} from '../../../shared/services/user-settings.service';

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
    activatedRoute: ActivatedRoute,
    userSettingsService: UserSettingsService
  ) {
    super(trackersService, auth, dialog, paginationService, router, activatedRoute, userSettingsService);

    this.entityFactory = () => new Tracker();

    this.columnParams = [
      new ColumnParams('TRACKER_INDEX_HEADER_NAME', (e: Tracker) => e.name),
      new ColumnParams('TRACKER_INDEX_HEADER_TYPE', (e: Tracker) => e.type),
      new ColumnParams('TRACKER_INDEX_HEADER_EVENT', (e: Tracker) => e.eventType.toString() || 'all'),
      new ColumnParams('TRACKER_INDEX_HEADER_DATA', (e: Tracker) => e.body).setCode(true),
    ];
  }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }
}
