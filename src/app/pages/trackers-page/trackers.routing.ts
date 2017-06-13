import {RouterModule} from '@angular/router';
import {TrackersComponent} from './trackers/trackers.component';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import {TrackerViewComponent} from './tracker-view/tracker-view.component';

export const trackersRouting = RouterModule.forChild([
  { path : '', component : TrackersComponent, canActivate: [TrackersAclGuard] },
  { path : ':id', component : TrackerViewComponent, canActivate: [TrackersAclGuard] }
]);

