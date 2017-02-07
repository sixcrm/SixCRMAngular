import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BaseService} from './services/base.service';
import {CalloutComponent} from './layout/callout/callout.component';
import {WidgetComponent} from './layout/widget/widget.component';
import {ChipComponent} from './layout/chip/chip.component';
import {MaterialModule} from '@angular/material';
import {ColorService} from './services/color.service';
import {CodeHighlighterDirective} from './layout/code-highlighter/code-highlighter.directive';
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

@NgModule({
  declarations : [
    CalloutComponent, WidgetComponent, ChipComponent, CodeHighlighterDirective
  ],
  exports : [CalloutComponent, WidgetComponent, ChipComponent, CodeHighlighterDirective],
  imports : [FormsModule, CommonModule, MaterialModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule : SharedModule,
      providers : [
        BaseService,
        ColorService,
        CampaignsService,
        ProductsService,
        MerchantProvidersService,
        FulfillmentProvidersService,
        AffiliatesService,
        CustomersService,
        SessionsService,
        LoadBalancersService,
        TransactionsService,
        CreditCardsService
      ]
    };
  }
}
