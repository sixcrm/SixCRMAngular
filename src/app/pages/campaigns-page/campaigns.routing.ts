import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../../navigation/layouts/default/default.layout.component";
import {CampaignsComponent} from './campaigns.component';
import {CampaignsAclGuard} from '../guards/campaigns-acl-guard.service';
import {CampaignViewComponent} from './campaign-view/campaign-view.component';

export const campaignsRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : CampaignsComponent, canActivate: [CampaignsAclGuard] },
      { path : ':id', component : CampaignViewComponent, canActivate: [CampaignsAclGuard] },
    ]
  }
]);

