import {RouterModule} from '@angular/router';
import {DefaultLayoutComponent} from "../navigation/layouts/default/default.layout.component";
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {CampaignsComponent} from "./campaigns-page/campaigns.component";
import {ProductsComponent} from "./products-page/products.component";
import {MerchantProvidersComponent} from "./merchant-providers-page/merchant-providers.component";
import {FulfillmentProvidersComponent} from "./fulfillment-providers/fulfillment-providers.component";
import {AffiliatesComponent} from "./affiliates-page/affiliates.component";
import {SessionsComponent} from "./sessions-page/sessions.component";
import {CustomersComponent} from "./customers-page/customers.component";
import {TransactionsComponent} from "./transactions-page/transactions.component";
import {LoadBalancersComponent} from "./load-balancers-page/load-balancers.component";
import {CampaignViewComponent} from './campaigns-page/campaign-view/campaign-view.component';
import {MerchantProviderViewComponent} from './merchant-providers-page/merchant-provider-view/merchant-provider-view.component';
import {FulfillmentProviderViewComponent} from './fulfillment-providers/fulfillment-provider-view/fulfillment-provider-view.component';
import {AffiliatesViewComponent} from './affiliates-page/affiliates-view/affiliates-view.component';
import {CustomerViewComponent} from './customers-page/customer-view/customer-view.component';
import {LoadBalancerViewComponent} from './load-balancers-page/load-balancer-view/load-balancer-view.component';
import {TransactionViewComponent} from './transactions-page/transaction-view/transaction-view.component';
import {SessionViewComponent} from './sessions-page/session-view/session-view.component';
import {ProductViewComponent} from './products-page/product-view/product-view.component';
import {CreditCardsComponent} from './credit-cards-page/credit-cards.component';
import {CreditCardViewComponent} from './credit-cards-page/credit-card-view/credit-card-view.component';

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', redirectTo : 'campaigns', pathMatch: 'full' },
      { path : 'campaigns', component : CampaignsComponent },
      { path : 'campaigns/:id', component : CampaignViewComponent },
      { path : 'products', component : ProductsComponent },
      { path : 'products/:id', component : ProductViewComponent },
      { path : 'merchantProviders', component : MerchantProvidersComponent },
      { path : 'merchantProviders/:id', component : MerchantProviderViewComponent },
      { path : 'fulfillmentProviders', component : FulfillmentProvidersComponent },
      { path : 'fulfillmentProviders/:id', component : FulfillmentProviderViewComponent },
      { path : 'affiliates', component : AffiliatesComponent },
      { path : 'affiliates/:id', component : AffiliatesViewComponent },
      { path : 'customers', component : CustomersComponent },
      { path : 'customers/:id', component : CustomerViewComponent },
      { path : 'sessions', component : SessionsComponent },
      { path : 'sessions/:id', component : SessionViewComponent },
      { path : 'loadBalancers', component : LoadBalancersComponent },
      { path : 'loadBalancers/:id', component : LoadBalancerViewComponent },
      { path : 'transactions', component : TransactionsComponent },
      { path : 'transactions/:id', component : TransactionViewComponent },
      { path : 'creditCards', component : CreditCardsComponent },
      { path : 'creditCards/:id', component : CreditCardViewComponent },
      { path : 'profile', component : ProfilePageComponent },
    ]
  }
]);

