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
import {CreditCardsComponent} from './credit-cards-page/credit-cards.component';
import {UsersComponent} from './users-page/users.component';
import {SmtpProvidersComponent} from './smtp-providers-page/smtp-providers.component';
import {EmailsComponent} from './emails-page/emails.component';
import {AccessKeysComponent} from './access-keys-page/access-keys.component';
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
import {ProductSchedulesComponent} from './product-schedule-page/product-schedules.component';

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', component : DashboardComponent },
      { path : 'campaigns', component : CampaignsComponent, canActivate: [CampaignsAclGuard] },
      { path : 'products', component : ProductsComponent, canActivate: [ProductsAclGuard] },
      { path : 'productSchedule', component : ProductSchedulesComponent, canActivate: [ProductSchedulesAclGuard] },
      { path : 'merchantProviders', component : MerchantProvidersComponent, canActivate: [MerchantProvidersAclGuard] },
      { path : 'fulfillmentProviders', component : FulfillmentProvidersComponent, canActivate: [FulfillmentProvidersAclGuard] },
      { path : 'affiliates', component : AffiliatesComponent, canActivate: [AffiliatesAclGuard] },
      { path : 'customers', component : CustomersComponent, canActivate: [CustomersAclGuard] },
      { path : 'sessions', component : SessionsComponent, canActivate: [SessionsAclGuard] },
      { path : 'loadBalancers', component : LoadBalancersComponent, canActivate: [LoadBalancersAclGuard] },
      { path : 'transactions', component : TransactionsComponent, canActivate: [TransactionsAclGuard] },
      { path : 'creditCards', component : CreditCardsComponent, canActivate: [CreditCardsAclGuard] },
      { path : 'users', component : UsersComponent, canActivate: [UsersAclGuard] },
      { path : 'smtpProviders', component : SmtpProvidersComponent, canActivate: [SmtpProvidersAclGuard] },
      { path : 'emails', component : EmailsComponent, canActivate: [EmailsAclGuard] },
      { path : 'accessKeys', component : AccessKeysComponent },
      { path : 'profile', component : ProfilePageComponent },
      { path : 'search', component : SearchComponent },
      { path : 'search/:searchTerm', component : SearchComponent },
    ]
  }
]);

