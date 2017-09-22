import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {affiliatesRouting } from './affiliates.routing';
import {MaterialModule} from '@angular/material';
import {AffiliatesComponent} from './affiliates-index/affiliates.component';
import {AffiliateViewComponent} from './affiliate-view/affiliate-view.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {AffiliatesAclGuard} from '../guards/affiliates-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';
import { AffiliateTrackersComponent } from './affiliate-view/affiliate-trackers/affiliate-trackers.component';
import { AffiliateSessionsComponent } from './affiliate-view/affiliate-sessions/affiliate-sessions.component';
import { AffiliateCampaignsComponent } from './affiliate-view/affiliate-campaigns/affiliate-campaigns.component';
import { AffiliateAddNewComponent } from './affiliate-view/affiliate-add-new/affiliate-add-new.component';

@NgModule({
  imports : [
    affiliatesRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    AffiliatesComponent,
    AffiliateViewComponent,
    AffiliateTrackersComponent,
    AffiliateSessionsComponent,
    AffiliateCampaignsComponent,
    AffiliateAddNewComponent
  ],
  exports : [ ],
  providers: [
    AffiliatesAclGuard
  ]
})
export class AffiliatesModule {
}
