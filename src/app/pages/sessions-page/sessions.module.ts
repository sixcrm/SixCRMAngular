import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {sessionsRouting} from './sessions.routing';
import {MaterialModule} from '@angular/material';
import {SessionsComponent} from './sessions.component';
import {SessionViewComponent} from './session-view/session-view.component';
import {SessionsAclGuard} from '../guards/sessions-acl-guard.service';
import {SessionComponent} from './session/session.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports : [
    sessionsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    PageComponentsModule,
    SharedModule
  ],
  declarations : [
    SessionsComponent,
    SessionViewComponent,
    SessionComponent
  ],
  exports : [
    SessionComponent
  ],
  providers: [
    SessionsAclGuard
  ]
})
export class SessionsModule {
}
