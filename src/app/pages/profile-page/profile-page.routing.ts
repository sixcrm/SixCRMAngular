import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {ProfilePageComponent} from './profile-page.component';

export const profileRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : ProfilePageComponent },
      { path : '**', redirectTo: '' }
    ]
  }
]);

