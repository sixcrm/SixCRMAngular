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
import {UsersComponent} from './users-page/users.component';
import {UserViewComponent} from './users-page/user-view/user-view.component';
import {SmtpProvidersComponent} from './smtp-providers-page/smtp-providers.component';
import {SmtpProviderViewComponent} from './smtp-providers-page/smtp-provider-view/smtp-provider-view.component';
import {EmailsComponent} from './emails-page/emails.component';
import {EmailViewComponent} from './emails-page/email-view/email-view.component';
import {AccessKeysComponent} from './access-keys-page/access-keys.component';
import {AccessKeyViewComponent} from './access-keys-page/access-key-view/access-key-view.component';
import {ProductScheduleComponent} from './product-schedule-page/product-schedule.component';
import {ProductScheduleViewComponent} from './product-schedule-page/product-schedule-view/product-schedule-view.component';
import {DashboardComponent} from './dashboard-page/dashboard.component';
import {SearchComponent} from './search-page/search.component';

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : DashboardComponent },

      { path : 'campaigns', component : CampaignsComponent },
      { path : 'campaigns/:type', component : CampaignViewComponent },
      { path : 'campaigns/:type/:id', component : CampaignViewComponent },

      { path : 'products', component : ProductsComponent },
      { path : 'products/:type', component : ProductViewComponent },
      { path : 'products/:type/:id', component : ProductViewComponent },

      { path : 'productSchedule', component : ProductScheduleComponent },
      { path : 'productSchedule/:type', component : ProductScheduleViewComponent },
      { path : 'productSchedule/:type/:id', component : ProductScheduleViewComponent },

      { path : 'merchantProviders', component : MerchantProvidersComponent },
      { path : 'merchantProviders/:type', component : MerchantProviderViewComponent },
      { path : 'merchantProviders/:type/:id', component : MerchantProviderViewComponent },

      { path : 'fulfillmentProviders', component : FulfillmentProvidersComponent },
      { path : 'fulfillmentProviders/:type', component : FulfillmentProviderViewComponent },
      { path : 'fulfillmentProviders/:type/:id', component : FulfillmentProviderViewComponent },

      { path : 'affiliates', component : AffiliatesComponent },
      { path : 'affiliates/:type', component : AffiliatesViewComponent },
      { path : 'affiliates/:type/:id', component : AffiliatesViewComponent },

      { path : 'customers', component : CustomersComponent },
      { path : 'customers/:type', component : CustomerViewComponent },
      { path : 'customers/:type/:id', component : CustomerViewComponent },

      { path : 'sessions', component : SessionsComponent },
      { path : 'sessions/:type', component : SessionViewComponent },
      { path : 'sessions/:type/:id', component : SessionViewComponent },

      { path : 'loadBalancers', component : LoadBalancersComponent },
      { path : 'loadBalancers/:type', component : LoadBalancerViewComponent },
      { path : 'loadBalancers/:type/:id', component : LoadBalancerViewComponent },

      { path : 'transactions', component : TransactionsComponent },
      { path : 'transactions/:type', component : TransactionViewComponent },
      { path : 'transactions/:type/:id', component : TransactionViewComponent },

      { path : 'creditCards', component : CreditCardsComponent },
      { path : 'creditCards/:type', component : CreditCardViewComponent },
      { path : 'creditCards/:type/:id', component : CreditCardViewComponent },

      { path : 'users', component : UsersComponent },
      { path : 'users/:type', component : UserViewComponent },
      { path : 'users/:type/:id', component : UserViewComponent },

      { path : 'smtpProviders', component : SmtpProvidersComponent },
      { path : 'smtpProviders/:type', component : SmtpProviderViewComponent },
      { path : 'smtpProviders/:type/:id', component : SmtpProviderViewComponent },

      { path : 'emails', component : EmailsComponent },
      { path : 'emails/:type', component : EmailViewComponent },
      { path : 'emails/:type/:id', component : EmailViewComponent },

      { path : 'accessKeys', component : AccessKeysComponent },
      { path : 'accessKeys/:type', component : AccessKeyViewComponent },
      { path : 'accessKeys/:type/:id', component : AccessKeyViewComponent },

      { path : 'profile', component : ProfilePageComponent },

      { path : 'search', component : SearchComponent },
      { path : 'search/:searchTerm', component : SearchComponent },
    ]
  }
]);

