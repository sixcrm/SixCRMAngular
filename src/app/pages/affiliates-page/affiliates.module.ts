import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {affiliatesRouting } from './affiliates.routing';
import {SharedModule} from '../../shared/shared.module';
import {NavigationModule} from '../../navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {AffiliatesComponent} from './affiliates.component';
import {AffiliateViewComponent} from './affiliate-view/affiliate-view.component';
import {AffiliateComponent} from './affiliate/affiliate.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {AffiliatesAclGuard} from '../guards/affiliates-acl-guard.service';

@NgModule({
  imports : [
    affiliatesRouting,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
  ],
  declarations : [
    AffiliatesComponent,
    AffiliateViewComponent,
    AffiliateComponent
  ],
  exports : [
    AffiliateComponent
  ],
  providers: [
    AffiliatesAclGuard
  ]
})
export class AffiliatesModule {
}
