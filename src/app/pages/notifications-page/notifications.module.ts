import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import {MaterialModule} from '@angular/material';
import {notificationsRouting} from './notifications.routing';

@NgModule({
  imports: [
    notificationsRouting,
    CommonModule,
    MaterialModule,
  ],
  declarations: [NotificationsComponent]
})
export class NotificationsModule { }
