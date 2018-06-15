import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import {trackersRouting} from './trackers.routing';
import {FormsModule} from '@angular/forms';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TrackerViewComponent} from './tracker-view/tracker-view.component';
import {CodemirrorModule} from 'ng2-codemirror';
import {TrackersComponent} from './trackers-index/trackers.component';
import { TrackerAddNewComponent } from './tracker-view/tracker-add-new/tracker-add-new.component';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports: [
    trackersRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    CodemirrorModule,
    TranslationModule
  ],
  declarations: [
    TrackersComponent,
    TrackerViewComponent,
    TrackerAddNewComponent,
  ],
  providers: [
    TrackersAclGuard
  ]
})
export class TrackersModule { }
