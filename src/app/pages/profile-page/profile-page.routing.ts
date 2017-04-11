import {RouterModule} from '@angular/router';
import {ProfilePageComponent} from './profile-page.component';

export const profileRouting = RouterModule.forChild([
  { path : '', component : ProfilePageComponent },
  { path : '**', redirectTo: '' }
]);

