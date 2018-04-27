import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import {notificationsRouting} from './notifications.routing';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { NotificationsSectionComponent } from './notifications-section/notifications-section.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from "../../translation/translation.module";
import {FormsModule} from '@angular/forms';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';

@NgModule({
  imports: [
    notificationsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    InfiniteScrollModule,
    SharedModule,
    TranslationModule
  ],
  declarations: [
    NotificationsComponent,
    NotificationsSectionComponent
  ]
})
export class NotificationsModule { }
