import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {WidgetComponent} from './layout/widget/widget.component';
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
import {EmailsService} from './services/emails.service';
import {AccessKeysService} from './services/access-keys.service';
import {ProgressBarService} from './services/progress-bar.service';
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

@NgModule({
  declarations : [ WidgetComponent, AutocompleteComponent, HighlightPipe, FilterSearchResultsPipe, FilterEntitiesPipe, SortEntitiesPipe ],
  exports : [ WidgetComponent, AutocompleteComponent, HighlightPipe, FilterSearchResultsPipe, FilterEntitiesPipe, SortEntitiesPipe ],
  imports : [FormsModule, CommonModule, MaterialModule]
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
        CustomersService,
        SessionsService,
        LoadBalancersService,
        TransactionsService,
        CreditCardsService,
        UsersService,
        SmtpProvidersService,
        EmailsService,
        AccessKeysService,
        ProgressBarService,
        ProductScheduleService,
        PaginationService,
        RolesService,
        SearchService,
        CustomerNotesService,
        NotificationsService,
        NotificationsQuickService,
        RebillsService
      ]
    };
  }
}
