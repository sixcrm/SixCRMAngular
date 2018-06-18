import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PaginationService} from './services/pagination.service';
import {SearchService} from './services/search.service';
import {AutocompleteComponent} from './components/autocomplete/autocomplete.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { FilterSearchResultsPipe } from './pipes/filter-search-results.pipe';
import { FilterEntitiesPipe } from './pipes/filter-entities.pipe';
import { SortEntitiesPipe } from './pipes/sort-entities.pipe';
import {AnalyticsService} from './services/analytics.service';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { ShareLinkComponent } from './components/share-link/share-link.component';
import {SubArrayPipe} from './pipes/sub-array.pipe';
import {AnalyticsStorageService} from './services/analytics-storage.service';
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
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { FilterStringsPipe } from './pipes/filter-strings.pipe';
import { FilterEntitiesByFieldPipe } from './pipes/filter-entities-by-field.pipe';
import { FilterEntitiesByParamsPipe } from './pipes/filter-entities-by-params.pipe';
import {AutofocusDirective} from './directives/autofocus.directive';
import {ServerErrorMessageComponent} from './components/server-error-message/server-error-message.component';
import { AddScheduleComponent } from './components/add-schedule/add-schedule.component';
import {TextMaskModule} from 'angular2-text-mask';
import { ErrorSnackBarComponent } from './components/error-snack-bar/error-snack-bar.component';
import {SnackbarService} from './services/snackbar.service';
import {MerchantReportService} from './services/analytics/merchant-report.service';
import {TextMaskPipe} from './pipes/text-mask.pipe';
import {AffiliateReportService} from './services/analytics/affiliate-report.service';
import {AlertComponent} from './components/alert/alert.component';
import { TableLoaderComponent } from './components/table-loader/table-loader.component';
import { SpeLoaderComponent } from './components/spe-loader/spe-loader.component';
import { FormatDurationPipe } from './pipes/format-duration.pipe';
import { HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';
import {CustomerCreditCardViewComponent} from './components/customer-credit-card-view/customer-credit-card-view.component';
import { SimpleDatepickerComponent } from './components/simple-datepicker/simple-datepicker.component';
import {TranslationModule} from '../translation/translation.module';
import { TabHeaderComponent } from './components/tab-header/tab-header.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { SpeLoaderBodyComponent } from './components/spe-loader-body/spe-loader-body.component';
import {SpeLoaderHeaderBreadcrumbComponent} from './components/spe-loader-breadcrumb/spe-loader-breadcrumb.component';
import { SpeLoaderHeaderComponent } from './components/spe-loader-header/spe-loader-header.component';
import { SpeLoaderBlueHeaderComponent } from './components/spe-loader-blue-header/spe-loader-blue-header.component';
import {VisibleYDirective} from './directives/visible-y.directive';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { DragScrollXDirective } from './directives/drag-scroll-x.directive';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import {ClipboardModule} from 'ngx-clipboard';
import {EntityServicesModule} from '../entity-services/entity-services.module';
import {FeatureFlagService} from './services/feature-flag.service';

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
    FilterEntitiesByFieldPipe,
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
    SearchInputComponent,
    FilterInputComponent,
    SpeLoaderBodyComponent,
    SpeLoaderHeaderBreadcrumbComponent,
    SpeLoaderHeaderComponent,
    SpeLoaderBlueHeaderComponent,
    MultiselectComponent,
    CurrencyInputDirective,
    VisibleYDirective,
    DragScrollXDirective,
    PaymentFormComponent
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
    FilterEntitiesByFieldPipe,
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
    SearchInputComponent,
    FilterInputComponent,
    MultiselectComponent,
    CurrencyInputDirective,
    VisibleYDirective,
    DragScrollXDirective,
    PaymentFormComponent
  ],
  imports : [
    FormsModule,
    CommonModule,
    MaterialSelectionModule,
    ChartModule,
    Daterangepicker,
    TextMaskModule,
    TranslationModule,
    ClipboardModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : SharedModule,
      providers : [
        PaginationService,
        SearchService,
        AnalyticsService,
        AnalyticsStorageService,
        TransactionReportService,
        MerchantReportService,
        AffiliateReportService,
        TimeService,
        SnackbarService,
        FeatureFlagService
      ]
    };
  }
}
