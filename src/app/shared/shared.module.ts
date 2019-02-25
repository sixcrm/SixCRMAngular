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
import {TablePaginationComponent} from './components/table-pagination/table-pagination.component';
import {ChartModule} from 'angular2-highcharts';
import {Daterangepicker} from 'ng2-daterangepicker';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FormatDateTimePipe } from './pipes/format-date-time.pipe';
import {TimeService} from './services/time.service';
import {SimpleDropdownComponent} from './components/simple-dropdown/simple-dropdown.component';
import { CreditCardFormatPipe } from './pipes/credit-card-format.pipe';
import { CreditCardExpirationPipe } from './pipes/credit-card-expiration.pipe';
import { InputCreditCardComponent } from './components/input-credit-card/input-credit-card.component';
import { AutocompleteInputComponent } from './components/autocomplete-input/autocomplete-input.component';
import { FilterStringsPipe } from './pipes/filter-strings.pipe';
import { FilterEntitiesByFieldPipe } from './pipes/filter-entities-by-field.pipe';
import { FilterEntitiesByParamsPipe } from './pipes/filter-entities-by-params.pipe';
import {AutofocusDirective} from './directives/autofocus.directive';
import {ServerErrorMessageComponent} from './components/server-error-message/server-error-message.component';
import {TextMaskModule} from 'angular2-text-mask';
import { ErrorSnackBarComponent } from './components/error-snack-bar/error-snack-bar.component';
import {SnackbarService} from './services/snackbar.service';
import {TextMaskPipe} from './pipes/text-mask.pipe';
import {AlertComponent} from './components/alert/alert.component';
import { TableLoaderComponent } from './components/table-loader/table-loader.component';
import { SpeLoaderComponent } from './components/spe-loader/spe-loader.component';
import { FormatDurationPipe } from './pipes/format-duration.pipe';
import { HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';
import { SimpleDatepickerComponent } from './components/simple-datepicker/simple-datepicker.component';
import {TranslationModule} from '../translation/translation.module';
import { TabHeaderComponent } from './components/tab-header/tab-header.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { FilterInputComponent } from './components/filter-input/filter-input.component';
import { SpeLoaderBodyComponent } from './components/spe-loader-body/spe-loader-body.component';
import { SpeLoaderHeaderComponent } from './components/spe-loader-header/spe-loader-header.component';
import { SpeLoaderBlueHeaderComponent } from './components/spe-loader-blue-header/spe-loader-blue-header.component';
import {VisibleYDirective} from './directives/visible-y.directive';
import { MultiselectComponent } from './components/multiselect/multiselect.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { DragScrollXDirective } from './directives/drag-scroll-x.directive';
import {MaterialSelectionModule} from '../material-selection/material-selection.module';
import {ClipboardModule} from 'ngx-clipboard';
import {FeatureFlagService} from './services/feature-flag.service';
import {NotificationsQuickService} from './services/notifications-quick.service';
import { FilterTableComponent } from './components/filter-table/filter-table.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { ValueFilterComponent } from './components/value-filter/value-filter.component';
import { ValueFilterDropdownComponent } from './components/value-filter-dropdown/value-filter-dropdown.component';
import { LocationFilterComponent } from './components/location-filter/location-filter.component';
import { FilterDaterangePickerComponent } from './components/filter-daterange-picker/filter-daterange-picker.component';
import { SingleFilterComponent } from './components/single-filter/single-filter.component';
import { FilterSaveAsComponent } from './components/filter-save-as/filter-save-as.component';
import {RouterModule} from '@angular/router';
import { FilterChipsPipePipe } from './pipes/filter-chips-pipe.pipe';
import { GrapesFilterComponentComponent } from './components/grapes-filter-component/grapes-filter-component.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';
import {FileUploadModule} from 'ng2-file-upload';
import { RemoveItemsPipe } from './pipes/remove-items.pipe';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { FilterSimplePipe } from './pipes/filter-simple.pipe';
import { BulkSelectorComponent } from './components/bulk-selector/bulk-selector.component';
import { SliderGalleryComponent } from './components/slider-gallery/slider-gallery.component';
import { SliderGalleryItemDirective } from './components/slider-gallery/slider-gallery-item.directive';
import { CustomMatDropdownComponent } from './components/custom-mat-dropdown/custom-mat-dropdown.component';

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
    DropdownComponent,
    FormatDateTimePipe,
    SimpleDropdownComponent,
    CreditCardFormatPipe,
    CreditCardExpirationPipe,
    InputCreditCardComponent,
    AutocompleteInputComponent,
    FilterStringsPipe,
    FilterEntitiesByParamsPipe,
    FilterEntitiesByFieldPipe,
    ServerErrorMessageComponent,
    ErrorSnackBarComponent,
    TextMaskPipe,
    AlertComponent,
    TableLoaderComponent,
    SpeLoaderComponent,
    FormatDurationPipe,
    HtmlSanitizerPipe,
    SimpleDatepickerComponent,
    TabHeaderComponent,
    SearchInputComponent,
    FilterInputComponent,
    SpeLoaderBodyComponent,
    SpeLoaderHeaderComponent,
    SpeLoaderBlueHeaderComponent,
    MultiselectComponent,
    CurrencyInputDirective,
    VisibleYDirective,
    DragScrollXDirective,
    FilterTableComponent,
    ValueFilterComponent,
    ValueFilterDropdownComponent,
    LocationFilterComponent,
    FilterDaterangePickerComponent,
    SingleFilterComponent,
    FilterSaveAsComponent,
    FilterChipsPipePipe,
    GrapesFilterComponentComponent,
    ImageUploaderComponent,
    RemoveItemsPipe,
    PaymentFormComponent,
    FilterSimplePipe,
    BulkSelectorComponent,
    SliderGalleryComponent,
    SliderGalleryItemDirective,
    CustomMatDropdownComponent
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
    FormatDateTimePipe,
    SimpleDropdownComponent,
    CreditCardFormatPipe,
    DropdownComponent,
    CreditCardExpirationPipe,
    InputCreditCardComponent,
    ComingSoonComponent,
    AutocompleteInputComponent,
    FilterStringsPipe,
    FilterEntitiesByParamsPipe,
    FilterEntitiesByFieldPipe,
    ServerErrorMessageComponent,
    TextMaskPipe,
    AlertComponent,
    TableLoaderComponent,
    SpeLoaderComponent,
    FormatDurationPipe,
    HtmlSanitizerPipe,
    SimpleDatepickerComponent,
    TabHeaderComponent,
    SearchInputComponent,
    FilterInputComponent,
    MultiselectComponent,
    CurrencyInputDirective,
    VisibleYDirective,
    DragScrollXDirective,
    FilterTableComponent,
    ValueFilterComponent,
    LocationFilterComponent,
    FilterDaterangePickerComponent,
    SingleFilterComponent,
    FilterSaveAsComponent,
    FilterChipsPipePipe,
    ImageUploaderComponent,
    RemoveItemsPipe,
    PaymentFormComponent,
    FilterSimplePipe,
    BulkSelectorComponent,
    SliderGalleryComponent,
    SliderGalleryItemDirective,
    CustomMatDropdownComponent
  ],
  imports : [
    FormsModule,
    CommonModule,
    RouterModule,
    MaterialSelectionModule,
    ChartModule,
    Daterangepicker,
    TextMaskModule,
    TranslationModule,
    ClipboardModule,
    InfiniteScrollModule,
    FileUploadModule
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
        TimeService,
        SnackbarService,
        FeatureFlagService,
        NotificationsQuickService
      ]
    };
  }
}
