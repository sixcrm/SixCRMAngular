import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {NavigationModule} from './navigation/navigation.module';
import {GithubService} from './shared/services/github.service';
import {BaseService} from './shared/services/base.service';
import {MaterialModule} from '@angular/material';
import {AgmCoreModule} from 'angular2-google-maps/core';
import {Angulartics2Module, Angulartics2GoogleAnalytics} from 'angulartics2';
import {SampleDialogComponent} from './examples/dialog/sample-dialog/sample-dialog.component';
import {SampleMenuDialogComponent} from './examples/dialog/sample-menu-dialog/sample-menu-dialog.component';
import {MdSnackBar} from '../../node_modules/@angular/material/snack-bar/snack-bar';
import {CompletedDialogComponent} from './examples/wizard/completed-dialog/completed-dialog.component';

@NgModule({
  declarations : [
    AppComponent, SampleDialogComponent, SampleMenuDialogComponent, CompletedDialogComponent
  ],
  imports : [
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AgmCoreModule.forRoot({
      apiKey : 'YOUR_API_KEY_HERE' // Enter your key here!
    }),
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    MaterialModule.forRoot()
  ],
  providers : [BaseService, GithubService, MdSnackBar],
  entryComponents : [AppComponent, SampleDialogComponent, SampleMenuDialogComponent, CompletedDialogComponent],
  bootstrap : [AppComponent]
})
export class AppModule {
}
