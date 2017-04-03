import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {NavigationModule} from './navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {Angulartics2Module, Angulartics2GoogleAnalytics} from 'angulartics2';
import {AuthenticationModule} from "./authentication/authentication.module";
import {DeleteDialogComponent} from './pages/delete-dialog.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations : [
    AppComponent, DeleteDialogComponent, ErrorPageComponent
  ],
  imports : [
    NavigationModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AuthenticationModule,
    routing,
    AgmCoreModule.forRoot({
      apiKey : 'YOUR_API_KEY_HERE' // Enter your key here!
    }),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    MaterialModule.forRoot()
  ],
  exports: [
    MaterialModule
  ],
  providers : [],
  entryComponents : [AppComponent, DeleteDialogComponent],
  bootstrap : [AppComponent]
})
export class AppModule {
}
