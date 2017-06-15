import { Injectable } from '@angular/core';
import {Tracker} from '../models/tracker.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Http} from '@angular/http';
import {
  trackersListQuery, trackerQuery, deleteTrackerMutation, updateTrackerMutation,
  createTrackerMutation
} from '../utils/query-builder';

@Injectable()
export class TrackersService extends AbstractEntityService<Tracker> {

  constructor(http: Http, authService: AuthenticationService) {
    super(
      http,
      authService,
      data => new Tracker(data),
      trackersListQuery,
      trackerQuery,
      deleteTrackerMutation,
      createTrackerMutation,
      updateTrackerMutation,
      'tracker'
    );
  }
}
