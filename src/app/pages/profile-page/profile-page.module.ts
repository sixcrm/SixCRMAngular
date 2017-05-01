import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {profileRouting} from './profile-page.routing';
import {ProfilePageComponent} from './profile-page.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    profileRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    SharedModule
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
