import {RouterModule} from '@angular/router';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import {TrackerViewComponent} from './tracker-view/tracker-view.component';
import {TrackersComponent} from './trackers-index/trackers.component';

export const trackersRouting = RouterModule.forChild([
  { path : '', component : TrackersComponent, canActivate: [TrackersAclGuard] },
  { path : ':id', component : TrackerViewComponent, canActivate: [TrackersAclGuard] }
]);

