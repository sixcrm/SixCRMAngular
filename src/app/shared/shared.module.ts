import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {CampaignsService} from "./services/campaigns.service";
import {ProductsService} from "./services/products.service";
import {MerchantProvidersService} from "./services/merchant-providers.service";
import {FulfillmentProvidersService} from "./services/fulfillment-providers.service";
import {AffiliatesService} from "./services/affiliates.service";
import {CustomersService} from "./services/customers.service";
import {SessionsService} from "./services/sessions.service";
import {LoadBalancersService} from "./services/load-balancers.service";
import {TransactionsService} from "./services/transactions.service";
import {CreditCardsService} from './services/credit-cards.service';
import {UsersService} from './services/users.service';
import {SmtpProvidersService} from './services/smtp-providers.service';
import {EmailTemplatesService} from './services/email-templates.service';
import {AccessKeysService} from './services/access-keys.service';
import {ProductScheduleService} from './services/product-schedule.service';
import {PaginationService} from './services/pagination.service';
import {RolesService} from './services/roles.service';
import {SearchService} from './services/search.service';
import {AutocompleteComponent} from './components/autocomplete/autocomplete.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import {CustomerNotesService} from './services/customer-notes.service';
import {NotificationsService} from './services/notifications.service';
import {NotificationsQuickService} from './services/notifications-quick.service';
import { FilterSearchResultsPipe } from './pipes/filter-search-results.pipe';
import { FilterEntitiesPipe } from './pipes/filter-entities.pipe';
import { SortEntitiesPipe } from './pipes/sort-entities.pipe';
import {RebillsService} from './services/rebills.service';
import {AnalyticsService} from './services/analytics.service';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { ShareLinkComponent } from './components/share-link/share-link.component';
import {SubArrayPipe} from './pipes/sub-array.pipe';
import {AnalyticsStorageService} from './services/analytics-storage.service';
import {UserSettingsService} from './services/user-settings.service';
import {NotificationSettingsService} from './services/notification-settings.service';
import { InViewportDirective } from './directives/in-viewport.directive';
import {TransactionReportService} from './services/analytics/transaction-report.service';
import {TablePaginationComponent} from './components/table-pagination/table-pagination.component';
import { AdvancedFilterComponent } from './components/advanced-filter/advanced-filter.component';
import {InputAutocompleteComponent} from './components/input-autocomplete/input-autocomplete.component';
import {ChartModule} from 'angular2-highcharts';
import {Daterangepicker} from 'ng2-daterangepicker';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FormatDateTimePipe } from './pipes/format-date-time.pipe';
import {TimeService} from './services/time.service';
import {SimpleDropdownComponent} from './components/simple-dropdown/simple-dropdown.component';
import { CreditCardFormatPipe } from './pipes/credit-card-format.pipe';
import { CreditCardExpirationPipe } from './pipes/credit-card-expiration.pipe';
import { InputCreditCardComponent } from './components/input-credit-card/input-credit-card.component';
import { CreditCardMaskPipe } from './pipes/credit-card-mask.pipe';
import {TrackersService} from './services/trackers.service';
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { FilterStringsPipe } from './pipes/filter-strings.pipe';
import { FilterEntitiesByParamsPipe } from './pipes/filter-entities-by-params.pipe';
import {AutofocusDirective} from './directives/autofocus.directive';
import {ServerErrorMessageComponent} from './components/server-error-message/server-error-message.component';
import {AccountsService} from './services/accounts.service';
import {AclsService} from './services/acls.service';
import { AddScheduleComponent } from './components/add-schedule/add-schedule.component';
import {TextMaskModule} from 'angular2-text-mask';
import { ErrorSnackBarComponent } from './components/error-snack-bar/error-snack-bar.component';
import {SnackbarService} from './services/snackbar.service';
import {MerchantReportService} from './services/analytics/merchant-report.service';
import {TextMaskPipe} from './pipes/text-mask.pipe';
import {AffiliateReportService} from './services/analytics/affiliate-report.service';
import {AlertsService} from './services/alerts.service';
import {AlertComponent} from './components/alert/alert.component';
import { TableLoaderComponent } from './components/table-loader/table-loader.component';
import { SpeLoaderComponent } from './components/spe-loader/spe-loader.component';
import {TermsAndConditionsControllerService} from './services/terms-and-conditions-controller.service';
import { FormatDurationPipe } from './pipes/format-duration.pipe';
import { HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';
import {CustomerCreditCardViewComponent} from './components/customer-credit-card-view/customer-credit-card-view.component';
import {BillsService} from './services/bills.service';
import { SimpleDatepickerComponent } from './components/simple-datepicker/simple-datepicker.component';
import {TranslationModule} from '../translation/translation.module';
import {UserSigningStringsService} from "./services/user-signing-string.service";
import { TabHeaderComponent } from './components/tab-header/tab-header.component';
import {ShippingReceiptsService} from './services/shipping-receipts.service';
import {ImagesService} from './services/images.service';
import { SearchInputComponent } from './components/search-input/search-input.component';
import {LoadBalancerAssociationsService} from './services/load-balancer-associations.service';

@NgModule({
  declarations : [
    AutocompleteComponent,
    HighlightPipe,
    FilterSearchResultsPipe,
    FilterEntitiesPipe,
    SortEntitiesPipe,
    ComingSoonComponent,
    ShareLinkComponent,
    SubArrayPipe,
    InViewportDirective,
    AutofocusDirective,
    TablePaginationComponent,
    AdvancedFilterComponent,
    InputAutocompleteComponent,
    DropdownComponent,
    FormatDateTimePipe,
    SimpleDropdownComponent,
    CreditCardFormatPipe,
    CreditCardExpirationPipe,
    InputCreditCardComponent,
    CreditCardMaskPipe,
    AutocompleteInputComponent,
    FilterStringsPipe,
    FilterEntitiesByParamsPipe,
    ServerErrorMessageComponent,
    AddScheduleComponent,
    ErrorSnackBarComponent,
    TextMaskPipe,
    AlertComponent,
    TableLoaderComponent,
    SpeLoaderComponent,
    FormatDurationPipe,
    HtmlSanitizerPipe,
    CustomerCreditCardViewComponent,
    SimpleDatepickerComponent,
    TabHeaderComponent,
    SearchInputComponent
  ],
  exports : [
    AutocompleteComponent,
    HighlightPipe,
    FilterSearchResultsPipe,
    FilterEntitiesPipe,
    SortEntitiesPipe,
    ShareLinkComponent,
    SubArrayPipe,
    InViewportDirective,
    AutofocusDirective,
    TablePaginationComponent,
    AdvancedFilterComponent,
    InputAutocompleteComponent,
    FormatDateTimePipe,
    SimpleDropdownComponent,
    CreditCardFormatPipe,
    DropdownComponent,
    CreditCardExpirationPipe,
    InputCreditCardComponent,
    CreditCardMaskPipe,
    ComingSoonComponent,
    AutocompleteInputComponent,
    FilterStringsPipe,
    FilterEntitiesByParamsPipe,
    ServerErrorMessageComponent,
    AddScheduleComponent,
    TextMaskPipe,
    AlertComponent,
    TableLoaderComponent,
    SpeLoaderComponent,
    FormatDurationPipe,
    HtmlSanitizerPipe,
    CustomerCreditCardViewComponent,
    SimpleDatepickerComponent,
    TabHeaderComponent,
    SearchInputComponent
  ],
  imports : [
    FormsModule,
    CommonModule,
    MaterialModule,
    ChartModule,
    Daterangepicker,
    TextMaskModule,
    TranslationModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : SharedModule,
      providers : [
        CampaignsService,
        ProductsService,
        MerchantProvidersService,
        FulfillmentProvidersService,
        AffiliatesService,
        AccountsService,
        AclsService,
        CustomersService,
        SessionsService,
        LoadBalancersService,
        TransactionsService,
        CreditCardsService,
        UsersService,
        SmtpProvidersService,
        EmailTemplatesService,
        AccessKeysService,
        ProductScheduleService,
        PaginationService,
        RolesService,
        SearchService,
        CustomerNotesService,
        NotificationsService,
        AlertsService,
        NotificationsQuickService,
        RebillsService,
        AnalyticsService,
        AnalyticsStorageService,
        UserSettingsService,
        NotificationSettingsService,
        TransactionReportService,
        MerchantReportService,
        AffiliateReportService,
        TimeService,
        TrackersService,
        SnackbarService,
        TermsAndConditionsControllerService,
        BillsService,
        UserSigningStringsService,
        ShippingReceiptsService,
        ImagesService,
        LoadBalancerAssociationsService
      ]
    };
  }
}
