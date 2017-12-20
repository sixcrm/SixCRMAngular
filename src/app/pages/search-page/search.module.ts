import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {searchRouting} from './search.routing';
import {ResultItemComponent} from './result-item/result-item.component';
import {PageComponentsModule} from '../components/pages-components.module';
import {Daterangepicker} from 'ng2-daterangepicker';
import {SharedModule} from '../../shared/shared.module';
import {AdvancedSearchComponent} from './advanced-search/advanced-search.component';
import { FilterByEntityTypePipe } from './pipes/filter-by-entity-type.pipe';
import {EntityListComponent} from './entity-list/entity-list.component';
import { PerfectMatchComponent } from './perfect-match/perfect-match.component';
import { PerfectCustomerComponent } from './perfect-match/perfect-customer/perfect-customer.component';
import { PerfectTransactionComponent } from './perfect-match/perfect-transaction/perfect-transaction.component';
import { PerfectProductComponent } from './perfect-match/perfect-product/perfect-product.component';
import { PerfectRebillComponent } from './perfect-match/perfect-rebill/perfect-rebill.component';
import { PerfectProductScheduleComponent } from './perfect-match/perfect-product-schedule/perfect-product-schedule.component';
import { PerfectCampaignComponent } from './perfect-match/perfect-campaign/perfect-campaign.component';
import { SearchLoaderComponent } from './search-loader/search-loader.component';
import {TranslationModule} from '../../translation/translation.module';

@NgModule({
  imports : [
    searchRouting,
    SharedModule,
    PageComponentsModule,
    CommonModule,
    FormsModule,
    MaterialModule.forRoot(),
    Daterangepicker,
    TranslationModule
  ],
  declarations : [
    SearchComponent,
    ResultItemComponent,
    AdvancedSearchComponent,
    EntityListComponent,
    FilterByEntityTypePipe,
    PerfectMatchComponent,
    PerfectCustomerComponent,
    PerfectTransactionComponent,
    PerfectProductComponent,
    PerfectRebillComponent,
    PerfectProductScheduleComponent,
    PerfectCampaignComponent,
    SearchLoaderComponent
  ],
  exports : [ ],
  providers: [ ]
})
export class SearchModule {
}
