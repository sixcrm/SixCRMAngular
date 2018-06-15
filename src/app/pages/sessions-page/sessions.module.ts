import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {sessionsRouting} from './sessions.routing';
import {SessionsComponent} from './sessions-index/sessions.component';
import {SessionViewComponent} from './session-view/session-view.component';
import {SessionsAclGuard} from '../guards/sessions-acl-guard.service';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';
import {TranslationModule} from '../../translation/translation.module';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    sessionsRouting,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    PageComponentsModule,
    SharedModule,
    EntityServicesModule,
    TranslationModule
  ],
  declarations : [
    SessionsComponent,
    SessionViewComponent
  ],
  exports : [ ],
  providers: [
    SessionsAclGuard
  ]
})
export class SessionsModule {
}
