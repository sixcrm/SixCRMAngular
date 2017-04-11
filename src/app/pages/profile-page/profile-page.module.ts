import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {profileRouting} from './profile-page.routing';
import {ProfilePageComponent} from './profile-page.component';

@NgModule({
  imports : [
    profileRouting,
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
