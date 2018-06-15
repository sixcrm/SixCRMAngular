import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SearchComponent} from './search.component';
import {searchRouting} from './search.routing';
import {PageComponentsModule} from '../components/pages-components.module';
import {Daterangepicker} from 'ng2-daterangepicker';
import {SharedModule} from '../../shared/shared.module';
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
import {PerfectMerchantProviderComponent} from './perfect-match/perfect-merchant-provider/perfect-merchant-provider.component';
import {PerfectCreditCardComponent} from './perfect-match/perfect-creditcard-provider/perfect-credit-card.component';
import {PerfectAffiliateComponent} from './perfect-match/perfect-affiliate-provider/perfect-affiliate.component';
import {MaterialSelectionModule} from '../../material-selection/material-selection.module';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {EntityServicesModule} from '../../entity-services/entity-services.module';

@NgModule({
  imports : [
    searchRouting,
    SharedModule,
    EntityServicesModule,
    PageComponentsModule,
    CommonModule,
    FormsModule,
    MaterialSelectionModule,
    Daterangepicker,
    TranslationModule,
    InfiniteScrollModule
  ],
  declarations : [
    SearchComponent,
    EntityListComponent,
    FilterByEntityTypePipe,
    PerfectMatchComponent,
    PerfectCustomerComponent,
    PerfectTransactionComponent,
    PerfectProductComponent,
    PerfectRebillComponent,
    PerfectProductScheduleComponent,
    PerfectCampaignComponent,
    PerfectMerchantProviderComponent,
    PerfectCreditCardComponent,
    PerfectAffiliateComponent,
    SearchLoaderComponent
  ],
  exports : [ ],
  providers: [ ]
})
export class SearchModule {
}
