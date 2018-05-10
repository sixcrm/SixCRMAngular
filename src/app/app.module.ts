import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {NavigationModule} from './navigation/navigation.module';
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
import {AddProductScheduleDialogComponent} from './pages/add-product-schedule-dialog.component';
import {ErrorSnackBarComponent} from './shared/components/error-snack-bar/error-snack-bar.component';
import {SingleInputDialogComponent} from './dialog-modals/single-input-dialog.component';
import {AccessKeyDetailsDialogComponent} from './dialog-modals/access-key-details-dialog.component';
import {ClipboardModule} from 'ngx-clipboard';
import { ErrorPageStandaloneComponent } from './error-page-standalone/error-page-standalone.component';
import {TranslationModule} from './translation/translation.module';
import {AddBillDetailsDialogComponent} from './dialog-modals/add-bill-details-dialog.component';
import {TextMaskModule} from 'angular2-text-mask';
import { ImageDialogComponent } from './dialog-modals/image-dialog/image-dialog.component';
import { MerchantProviderGroupAssociationDialogComponent } from './dialog-modals/merchantprovidergroup-association-dialog/merchantprovidergroup-association-dialog.component';
import {MaterialSelectionModule} from './material-selection/material-selection.module';
import {HttpWrapperTransactionalService} from './shared/services/http-wrapper-transactional.service';
import { TermsDialogComponent } from './dialog-modals/terms-dialog/terms-dialog.component';
import { BillingInfoComponent } from './billing-info/billing-info.component';
import { MarkdownModule } from 'angular2-markdown';

@NgModule({
  declarations : [
    AppComponent,
    DeleteDialogComponent,
    ErrorPageComponent,
    AssociateDialogComponent,
    InviteUserDialogComponent,
    AddUserAclDialogComponent,
    YesNoDialogComponent,
    MessageDialogComponent,
    AddProductScheduleDialogComponent,
    SingleInputDialogComponent,
    AccessKeyDetailsDialogComponent,
    ErrorPageStandaloneComponent,
    AddBillDetailsDialogComponent,
    ImageDialogComponent,
    MerchantProviderGroupAssociationDialogComponent,
    TermsDialogComponent,
    BillingInfoComponent
  ],
  imports : [
    NavigationModule.forRoot(),
    SharedModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AuthenticationModule,
    routing,
    MaterialSelectionModule,
    ClipboardModule,
    TranslationModule.forRoot(),
    TextMaskModule,
    MarkdownModule.forRoot()
  ],
  exports: [ ],
  providers : [ HttpWrapperService, HttpWrapperTransactionalService ],
  entryComponents : [
    AppComponent,
    DeleteDialogComponent,
    AssociateDialogComponent,
    InviteUserDialogComponent,
    AddUserAclDialogComponent,
    YesNoDialogComponent,
    MessageDialogComponent,
    AddProductScheduleDialogComponent,
    ErrorSnackBarComponent,
    SingleInputDialogComponent,
    AccessKeyDetailsDialogComponent,
    AddBillDetailsDialogComponent,
    ImageDialogComponent,
    MerchantProviderGroupAssociationDialogComponent,
    TermsDialogComponent
  ],
  bootstrap : [AppComponent]
})
export class AppModule {
}
