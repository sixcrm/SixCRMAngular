import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {pagesRouting} from './pages.routing';
import {SharedModule} from '../shared/shared.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import {NavigationModule} from '../navigation/navigation.module';
import { CampaignsComponent } from './campaigns-page/campaigns.component';
import {MaterialModule} from "@angular/material";

@NgModule({
  imports : [
    pagesRouting,
    SharedModule,
    NavigationModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations : [ProfilePageComponent, CampaignsComponent]
})
export class PagesModule {
}
