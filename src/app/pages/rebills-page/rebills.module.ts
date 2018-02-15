import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {rebillsRouting} from './rebills.routing';
import {SharedModule} from '../../shared/shared.module';
import {PageComponentsModule} from '../components/pages-components.module';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {RebillsComponent} from './rebills-index/rebills.component';
import {RebillsAclGuard} from '../guards/rebills-acl-guard.service';
import { RebillViewComponent } from './rebill-view/rebill-view.component';
import {TranslationModule} from '../../translation/translation.module';
import {RebillsPendingComponent} from "./rebills-pending-index/rebills-pending.component";

@NgModule({
  imports: [
    rebillsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    TranslationModule,
    SharedModule
  ],
  declarations: [RebillsComponent, RebillsPendingComponent, RebillViewComponent],
  providers: [RebillsAclGuard]
})
export class RebillsModule { }
