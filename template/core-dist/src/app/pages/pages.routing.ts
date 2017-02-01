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

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', redirectTo : 'campaigns', pathMatch: 'full' },
      { path : 'campaigns', component : CampaignsComponent },
    { path : 'products', component : ProductsComponent },
    { path : 'merchantProviders', component : MerchantProvidersComponent },
    { path : 'fulfillmentProviders', component : FulfillmentProvidersComponent },
    { path : 'affiliates', component : AffiliatesComponent },
    { path : 'customers', component : CustomersComponent },
    { path : 'sessions', component : SessionsComponent },
    { path : 'loadBalancers', component : LoadBalancersComponent },
    { path : 'transactions', component : TransactionsComponent },
    { path : 'profile', component : ProfilePageComponent },
    ]
  }
]);

