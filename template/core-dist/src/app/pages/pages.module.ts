import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {pagesRouting} from './pages.routing';
import {SharedModule} from '../shared/shared.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import {NavigationModule} from '../navigation/navigation.module';
import { CampaignsComponent } from './campaigns-page/campaigns.component';

@NgModule({
  imports : [
    pagesRouting,
    SharedModule,
    NavigationModule,
    CommonModule,
    FormsModule
  ],
  declarations : [ProfilePageComponent, CampaignsComponent]
})
export class PagesModule {
}
