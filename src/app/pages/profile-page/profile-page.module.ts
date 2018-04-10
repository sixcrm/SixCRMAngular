import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {profileRouting} from './profile-page.routing';
import {ProfilePageComponent} from './profile-page.component';
import {SharedModule} from '../../shared/shared.module';
import {TextMaskModule} from 'angular2-text-mask';
import {PageComponentsModule} from '../components/pages-components.module';
import {TranslationModule} from "../../translation/translation.module";
import {UserSigningStringsComponent} from "./user-signing-strings/user-signing-strings.component";
import {ClipboardModule} from "ngx-clipboard";
import { NotificationDevicesComponent } from './notification-devices/notification-devices.component';
import { NotificationPreferencesComponent } from './notification-preferences/notification-preferences.component';
import { DeviceToggleItemComponent } from './notification-devices/device-toggle-item/device-toggle-item.component';

@NgModule({
  imports : [
    profileRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    SharedModule,
    PageComponentsModule,
    TextMaskModule,
    TranslationModule,
    ClipboardModule
  ],
  declarations : [
    ProfilePageComponent,
    UserSigningStringsComponent,
    NotificationDevicesComponent,
    NotificationPreferencesComponent,
    DeviceToggleItemComponent
  ],
  exports : [
  ],
  providers: [
  ]
})
export class ProfilePageModule {
}
