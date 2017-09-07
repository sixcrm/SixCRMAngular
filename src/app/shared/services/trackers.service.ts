import { Injectable } from '@angular/core';
import {Tracker} from '../models/tracker.model';
import {AbstractEntityService} from './abstract-entity.service';
import {AuthenticationService} from '../../authentication/authentication.service';
import {HttpWrapperService} from './http-wrapper.service';
import {
  trackersListQuery, trackerQuery, deleteTrackerMutation,
  createTrackerMutation, updateTrackerMutation
} from '../utils/queries/entities/tracker.queries';
import {MdSnackBar} from '@angular/material';

@Injectable()
export class TrackersService extends AbstractEntityService<Tracker> {

  constructor(http: HttpWrapperService, authService: AuthenticationService, snackBar: MdSnackBar) {
    super(
      http,
      authService,
      data => new Tracker(data),
      trackersListQuery,
      trackerQuery,
      deleteTrackerMutation,
      createTrackerMutation,
      updateTrackerMutation,
      'tracker',
      snackBar
    );
  }
}
