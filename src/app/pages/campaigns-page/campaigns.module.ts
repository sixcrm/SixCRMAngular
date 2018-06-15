import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {campaignsRouting } from './campaigns.routing';
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
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    campaignsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
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
