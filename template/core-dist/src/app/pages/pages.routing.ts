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

export const pagesRouting = RouterModule.forChild([
  {
    path : '', component : DefaultLayoutComponent, children : [
      { path : '', redirectTo : 'campaigns', pathMatch: 'full' },
      { path : 'campaigns', component : CampaignsComponent },
      { path : 'campaigns/:id', component : CampaignViewComponent },
      { path : 'products', component : ProductsComponent },
      { path : 'merchantProviders', component : MerchantProvidersComponent },
      { path : 'merchantProviders/:id', component : MerchantProviderViewComponent },
      { path : 'fulfillmentProviders', component : FulfillmentProvidersComponent },
      { path : 'affiliates', component : AffiliatesComponent },
      { path : 'customers', component : CustomersComponent },
      { path : 'sessions', component : SessionsComponent },
      { path : 'loadBalancer', component : LoadBalancersComponent },
      { path : 'transactions', component : TransactionsComponent },
      { path : 'profile', component : ProfilePageComponent },
    ]
  }
]);

