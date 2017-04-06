import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {profileRouting} from './profile-page.routing';
import {ProfilePageComponent} from './profile-page.component';

@NgModule({
  imports : [
    profileRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot()
  ],
  declarations : [
    ProfilePageComponent
  ],
  exports : [
  ],
  providers: [
  ]
})
export class ProfilePageModule {
}
