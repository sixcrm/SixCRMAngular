import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackersAclGuard} from '../guards/trackers-acl-guard.service';
import { TrackersComponent } from './trackers/trackers.component';
import { TrackersViewComponent } from './trackers-view/trackers-view.component';
import {trackersRouting} from './trackers.routing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';

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
    TrackersViewComponent
  ],
  providers: [
    TrackersAclGuard
  ]
})
export class TrackersModule { }
