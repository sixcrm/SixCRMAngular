import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {NavigationModule} from './navigation/navigation.module';
import {MaterialModule} from '@angular/material';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {Angulartics2Module, Angulartics2GoogleAnalytics} from 'angulartics2';
import {AuthenticationModule} from "./authentication/authentication.module";
import {PagesModule} from "./pages/pages.module";
import {DeleteDialogComponent} from './pages/delete-dialog.component';

@NgModule({
  declarations : [
    AppComponent, DeleteDialogComponent
  ],
  imports : [
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    BrowserModule,
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
  providers : [],
  entryComponents : [AppComponent, DeleteDialogComponent],
  bootstrap : [AppComponent]
})
export class AppModule {
}
