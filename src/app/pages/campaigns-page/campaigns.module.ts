import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {campaignsRouting } from './campaigns.routing';
import {MaterialModule} from '@angular/material';
import {CampaignsComponent} from './campaigns-index/campaigns.component';
import {CampaignViewComponent} from './campaign-view/campaign-view.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {CampaignsAclGuard} from '../guards/campaigns-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';
import { CampaignAddNewComponent } from './campaign-view/campaign-add-new/campaign-add-new.component';
import { PixelTrackerComponent } from './campaign-view/pixel-tracker/pixel-tracker.component';
import {CodemirrorModule} from 'ng2-codemirror';
import {ClipboardModule} from 'ngx-clipboard';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports : [
    campaignsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
    CodemirrorModule,
    ClipboardModule,
    TranslationModule
  ],
  declarations : [
    CampaignsComponent,
    CampaignViewComponent,
    CampaignAddNewComponent,
    PixelTrackerComponent
  ],
  exports : [ ],
  providers: [
    CampaignsAclGuard
  ]
})
export class CampaignsModule {
}
