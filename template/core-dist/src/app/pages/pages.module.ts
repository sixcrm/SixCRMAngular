import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { pagesRouting } from './pages.routing';
import { SharedModule } from '../shared/shared.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { NavigationModule } from '../navigation/navigation.module';
import { CampaignsComponent } from './campaigns-page/campaigns.component';
import { MaterialModule } from "@angular/material";
import { ProductsComponent } from './products-page/products.component';
import { MerchantProvidersComponent } from './merchant-providers-page/merchant-providers.component';
import { FulfillmentProvidersComponent } from './fulfillment-providers/fulfillment-providers.component';
import { AffiliatesComponent } from './affiliates-page/affiliates.component';
import { CustomersComponent } from './customers-page/customers.component';
import { SessionsComponent } from './sessions-page/sessions.component';
import { LoadBalancersComponent } from './load-balancers-page/load-balancers.component';
import { TransactionsComponent } from './transactions-page/transactions.component';
import { CampaignViewComponent } from './campaigns-page/campaign-view/campaign-view.component';
import { MerchantProviderViewComponent } from './merchant-providers-page/merchant-provider-view/merchant-provider-view.component';
import { FulfillmentProviderViewComponent } from './fulfillment-providers/fulfillment-provider-view/fulfillment-provider-view.component';
import { AffiliatesViewComponent } from './affiliates-page/affiliates-view/affiliates-view.component';
import { CustomerViewComponent } from './customers-page/customer-view/customer-view.component';

@NgModule({
  imports : [
    pagesRouting,
    SharedModule,
    NavigationModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations : [
    ProfilePageComponent,
    CampaignsComponent,
    ProductsComponent,
    MerchantProvidersComponent,
    FulfillmentProvidersComponent,
    AffiliatesComponent,
    CustomersComponent,
    SessionsComponent,
    LoadBalancersComponent,
    TransactionsComponent,
    CampaignViewComponent,
    MerchantProviderViewComponent,
    FulfillmentProviderViewComponent,
    AffiliatesViewComponent,
    CustomerViewComponent
  ]
})
export class PagesModule {
}
