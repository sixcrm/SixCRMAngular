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
import {UsersAclGuard} from './guards/users-acl-guard.service';
import {ProductsAclGuard} from './guards/products-acl-guard.service';
import {CampaignsAclGuard} from './guards/campaigns-acl-guard.service';
import {ProductSchedulesAclGuard} from './guards/product-schedules-acl-guard.service';
import {MerchantProvidersAclGuard} from './guards/merchant-providers-acl-guard.service';
import {FulfillmentProvidersAclGuard} from './guards/fulfillment-providers-acl-guard.service';
import {AffiliatesAclGuard} from './guards/affiliates-acl-guard.service';
import {CustomersAclGuard} from './guards/customers-acl-guard.service';
import {SessionsAclGuard} from './guards/sessionss-acl-guard.service';
import {LoadBalancersAclGuard} from './guards/load-balancers-acl-guard.service';
import {TransactionsAclGuard} from './guards/transactions-acl-guard.service';
import {CreditCardsAclGuard} from './guards/creditcards-acl-guard.service';
import {SmtpProvidersAclGuard} from './guards/smtp-providers-acl-guard.service';
import {EmailsAclGuard} from './guards/emails-acl-guard.service';

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : DashboardComponent },

      { path : 'campaigns', component : CampaignsComponent, canActivate: [CampaignsAclGuard] },
      { path : 'campaigns/:type', component : CampaignViewComponent, canActivate: [CampaignsAclGuard] },
      { path : 'campaigns/:type/:id', component : CampaignViewComponent, canActivate: [CampaignsAclGuard] },

      { path : 'products', component : ProductsComponent, canActivate: [ProductsAclGuard] },
      { path : 'products/:type', component : ProductViewComponent, canActivate: [ProductsAclGuard] },
      { path : 'products/:type/:id', component : ProductViewComponent, canActivate: [ProductsAclGuard] },

      { path : 'productSchedule', component : ProductScheduleComponent, canActivate: [ProductSchedulesAclGuard] },
      { path : 'productSchedule/:type', component : ProductScheduleViewComponent, canActivate: [ProductSchedulesAclGuard] },
      { path : 'productSchedule/:type/:id', component : ProductScheduleViewComponent, canActivate: [ProductSchedulesAclGuard] },

      { path : 'merchantProviders', component : MerchantProvidersComponent, canActivate: [MerchantProvidersAclGuard] },
      { path : 'merchantProviders/:type', component : MerchantProviderViewComponent, canActivate: [MerchantProvidersAclGuard] },
      { path : 'merchantProviders/:type/:id', component : MerchantProviderViewComponent, canActivate: [MerchantProvidersAclGuard] },

      { path : 'fulfillmentProviders', component : FulfillmentProvidersComponent, canActivate: [FulfillmentProvidersAclGuard] },
      { path : 'fulfillmentProviders/:type', component : FulfillmentProviderViewComponent, canActivate: [FulfillmentProvidersAclGuard] },
      { path : 'fulfillmentProviders/:type/:id', component : FulfillmentProviderViewComponent, canActivate: [FulfillmentProvidersAclGuard] },

      { path : 'affiliates', component : AffiliatesComponent, canActivate: [AffiliatesAclGuard] },
      { path : 'affiliates/:type', component : AffiliatesViewComponent, canActivate: [AffiliatesAclGuard] },
      { path : 'affiliates/:type/:id', component : AffiliatesViewComponent, canActivate: [AffiliatesAclGuard] },

      { path : 'customers', component : CustomersComponent, canActivate: [CustomersAclGuard] },
      { path : 'customers/:type', component : CustomerViewComponent, canActivate: [CustomersAclGuard] },
      { path : 'customers/:type/:id', component : CustomerViewComponent, canActivate: [CustomersAclGuard] },

      { path : 'sessions', component : SessionsComponent, canActivate: [SessionsAclGuard] },
      { path : 'sessions/:type', component : SessionViewComponent, canActivate: [SessionsAclGuard] },
      { path : 'sessions/:type/:id', component : SessionViewComponent, canActivate: [SessionsAclGuard] },

      { path : 'loadBalancers', component : LoadBalancersComponent, canActivate: [LoadBalancersAclGuard] },
      { path : 'loadBalancers/:type', component : LoadBalancerViewComponent, canActivate: [LoadBalancersAclGuard] },
      { path : 'loadBalancers/:type/:id', component : LoadBalancerViewComponent, canActivate: [LoadBalancersAclGuard] },

      { path : 'transactions', component : TransactionsComponent, canActivate: [TransactionsAclGuard] },
      { path : 'transactions/:type', component : TransactionViewComponent, canActivate: [TransactionsAclGuard] },
      { path : 'transactions/:type/:id', component : TransactionViewComponent, canActivate: [TransactionsAclGuard] },

      { path : 'creditCards', component : CreditCardsComponent, canActivate: [CreditCardsAclGuard] },
      { path : 'creditCards/:type', component : CreditCardViewComponent, canActivate: [CreditCardsAclGuard] },
      { path : 'creditCards/:type/:id', component : CreditCardViewComponent, canActivate: [CreditCardsAclGuard] },

      { path : 'users', component : UsersComponent, canActivate: [UsersAclGuard] },
      { path : 'users/:type', component : UserViewComponent, canActivate: [UsersAclGuard] },
      { path : 'users/:type/:id', component : UserViewComponent, canActivate: [UsersAclGuard] },

      { path : 'smtpProviders', component : SmtpProvidersComponent, canActivate: [SmtpProvidersAclGuard] },
      { path : 'smtpProviders/:type', component : SmtpProviderViewComponent, canActivate: [SmtpProvidersAclGuard] },
      { path : 'smtpProviders/:type/:id', component : SmtpProviderViewComponent, canActivate: [SmtpProvidersAclGuard] },

      { path : 'emails', component : EmailsComponent, canActivate: [EmailsAclGuard] },
      { path : 'emails/:type', component : EmailViewComponent, canActivate: [EmailsAclGuard]  },
      { path : 'emails/:type/:id', component : EmailViewComponent, canActivate: [EmailsAclGuard]  },

      { path : 'accessKeys', component : AccessKeysComponent },
      { path : 'accessKeys/:type', component : AccessKeyViewComponent },
      { path : 'accessKeys/:type/:id', component : AccessKeyViewComponent },

      { path : 'profile', component : ProfilePageComponent },

      { path : 'search', component : SearchComponent },
      { path : 'search/:searchTerm', component : SearchComponent },
    ]
  }
]);

