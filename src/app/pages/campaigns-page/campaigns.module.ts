import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {campaignsRouting } from './campaigns.routing';
import {MaterialModule} from '@angular/material';
import {CampaignsComponent} from './campaigns.component';
import {CampaignViewComponent} from './campaign-view/campaign-view.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CampaignsAclGuard} from '../guards/campaigns-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    campaignsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    CampaignsComponent,
    CampaignViewComponent
  ],
  exports : [ ],
  providers: [
    CampaignsAclGuard
  ]
})
export class CampaignsModule {
}
