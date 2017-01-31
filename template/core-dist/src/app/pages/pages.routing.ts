import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../navigation/layouts/default/default.layout.component";
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {CampaignsComponent} from "./campaigns-page/campaigns.component";

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', redirectTo : 'campaigns', pathMatch: 'full' },
      { path : 'campaigns', component : CampaignsComponent },
      { path : 'profile', component : ProfilePageComponent },
    ]
  }
]);

