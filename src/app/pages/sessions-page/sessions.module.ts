import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {sessionsRouting} from './sessions.routing';
import {MaterialModule} from '@angular/material';
import {SessionsComponent} from './sessions.component';
import {SessionViewComponent} from './session-view/session-view.component';
import {SessionsAclGuard} from '../guards/sessions-acl-guard.service';
import {SessionComponent} from './session/session.component';
import {PageComponentsModule} from '../components/pages-components.module';

@NgModule({
  imports : [
    sessionsRouting,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    PageComponentsModule
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
