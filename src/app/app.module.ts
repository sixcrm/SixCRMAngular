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
import { InviteDialogComponent } from './dialog-modals/invite-dialog/invite-dialog.component';
import { AccessKeysDialogComponent } from './dialog-modals/access-keys-dialog/access-keys-dialog.component';
import { HttpWrapperCustomerService } from './shared/services/http-wrapper-customer.service';
import { RoleDialogComponent } from './dialog-modals/role-dialog/role-dialog.component';
import { CardSwitcherDialogComponent } from './dialog-modals/card-switcher-dialog/card-switcher-dialog.component';
import { AddCreditCardDialogComponent } from './dialog-modals/add-credit-card-dialog/add-credit-card-dialog.component';
import { AddCustomerDialogComponent } from './dialog-modals/add-customer-dialog/add-customer-dialog.component';
import { ViewTransactionDialogComponent } from './dialog-modals/view-transaction-dialog/view-transaction-dialog.component';
import { RefundDialogComponent } from './dialog-modals/refund-dialog/refund-dialog.component';
import { ReturnDialogComponent } from './dialog-modals/return-dialog/return-dialog.component';
import {EntityServicesModule} from './entity-services/entity-services.module';

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
    BillingInfoComponent,
    InviteDialogComponent,
    AccessKeysDialogComponent,
    RoleDialogComponent,
    CardSwitcherDialogComponent,
    AddCreditCardDialogComponent,
    AddCustomerDialogComponent,
    ViewTransactionDialogComponent,
    RefundDialogComponent,
    ReturnDialogComponent
  ],
  imports : [
    NavigationModule.forRoot(),
    SharedModule.forRoot(),
    EntityServicesModule,
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
  providers : [ HttpWrapperService, HttpWrapperTransactionalService, HttpWrapperCustomerService ],
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
    TermsDialogComponent,
    InviteDialogComponent,
    AccessKeysDialogComponent,
    RoleDialogComponent,
    CardSwitcherDialogComponent,
    AddCreditCardDialogComponent,
    AddCustomerDialogComponent,
    ViewTransactionDialogComponent,
    RefundDialogComponent,
    ReturnDialogComponent
  ],
  bootstrap : [AppComponent]
})
export class AppModule {
}
