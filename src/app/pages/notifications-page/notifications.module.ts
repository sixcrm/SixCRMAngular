import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import {MaterialModule} from '@angular/material';
import {notificationsRouting} from './notifications.routing';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    notificationsRouting,
    CommonModule,
    MaterialModule,
    InfiniteScrollModule
  ],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }
