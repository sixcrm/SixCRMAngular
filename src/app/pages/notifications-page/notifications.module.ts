import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import {MaterialModule} from '@angular/material';
import {notificationsRouting} from './notifications.routing';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { NotificationsSectionComponent } from './notifications-section/notifications-section.component';
import { AlertsSectionComponent } from './alerts-section/alerts-section.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from "../../translation/translation.module";
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    notificationsRouting,
    CommonModule,
    FormsModule,
    MaterialModule,
    InfiniteScrollModule,
    SharedModule,
    TranslationModule
  ],
  declarations: [NotificationsComponent, NotificationsSectionComponent, AlertsSectionComponent]
})
export class NotificationsModule { }
