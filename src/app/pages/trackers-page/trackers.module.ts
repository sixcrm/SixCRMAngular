import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import { TrackersComponent } from './trackers/trackers.component';
import {trackersRouting} from './trackers.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TrackerViewComponent} from './tracker-view/tracker-view.component';
import { TrackerAffiliatesComponent } from './tracker-view/tracker-affiliates/tracker-affiliates.component';

@NgModule({
  imports: [
    trackersRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule,
    SharedModule
  ],
  declarations: [
    TrackersComponent,
    TrackerViewComponent,
    TrackerAffiliatesComponent
  ],
  providers: [
    TrackersAclGuard
  ]
})
export class TrackersModule { }
