import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {NavigationModule} from './navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {AuthenticationModule} from "./authentication/authentication.module";
import {DeleteDialogComponent} from './pages/delete-dialog.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {AssociateDialogComponent} from './pages/associate-dialog.component';
import {HttpWrapperService} from './shared/services/http-wrapper.service';
import {InviteUserDialogComponent} from './pages/invite-user-dialog.component';
import {AddUserAclDialogComponent} from './pages/add-user-acl-dialog.component';
import {YesNoDialogComponent} from './pages/yes-no-dialog.component';
import {MessageDialogComponent} from './pages/message-dialog.component';

@NgModule({
  declarations : [
    AppComponent,
    DeleteDialogComponent,
    ErrorPageComponent,
    AssociateDialogComponent,
    InviteUserDialogComponent,
    AddUserAclDialogComponent,
    YesNoDialogComponent,
    MessageDialogComponent
  ],
  imports : [
    NavigationModule.forRoot(),
    SharedModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AuthenticationModule,
    routing,
    MaterialModule.forRoot()
  ],
  exports: [
    MaterialModule
  ],
  providers : [
    HttpWrapperService
  ],
  entryComponents : [
    AppComponent,
    DeleteDialogComponent,
    AssociateDialogComponent,
    InviteUserDialogComponent,
    AddUserAclDialogComponent,
    YesNoDialogComponent,
    MessageDialogComponent
  ],
  bootstrap : [AppComponent]
})
export class AppModule {
}
