import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import {trackersRouting} from './trackers.routing';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TrackerViewComponent} from './tracker-view/tracker-view.component';
import {CodemirrorModule} from 'ng2-codemirror';
import {TrackersComponent} from './trackers-index/trackers.component';
import { TrackerAddNewComponent } from './tracker-view/tracker-add-new/tracker-add-new.component';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports: [
    trackersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule,
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
