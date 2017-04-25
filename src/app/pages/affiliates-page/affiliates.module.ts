import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {affiliatesRouting } from './affiliates.routing';
import {MaterialModule} from '@angular/material';
import {AffiliatesComponent} from './affiliates.component';
import {AffiliateViewComponent} from './affiliate-view/affiliate-view.component';
import {AffiliateComponent} from './affiliate/affiliate.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {AffiliatesAclGuard} from '../guards/affiliates-acl-guard.service';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    affiliatesRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule,
    SharedModule
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
