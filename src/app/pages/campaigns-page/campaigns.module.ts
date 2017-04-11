import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {campaignsRouting } from './campaigns.routing';
import {MaterialModule} from '@angular/material';
import {CampaignsComponent} from './campaigns.component';
import {CampaignViewComponent} from './campaign-view/campaign-view.component';
import {CampaignComponent} from './campaign/campaign.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CampaignsAclGuard} from '../guards/campaigns-acl-guard.service';

@NgModule({
  imports : [
    campaignsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    CampaignsComponent,
    CampaignViewComponent,
    CampaignComponent
  ],
  exports : [
    CampaignComponent
  ],
  providers: [
    CampaignsAclGuard
  ]
})
export class CampaignsModule {
}
