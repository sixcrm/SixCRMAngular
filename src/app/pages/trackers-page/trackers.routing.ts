import {RouterModule} from '@angular/router';
import {TrackersComponent} from './trackers/trackers.component';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import {TrackersViewComponent} from './trackers-view/trackers-view.component';

export const trackersRouting = RouterModule.forChild([
  { path : '', component : TrackersComponent, canActivate: [TrackersAclGuard] },
  { path : ':id', component : TrackersViewComponent, canActivate: [TrackersAclGuard] }
]);

