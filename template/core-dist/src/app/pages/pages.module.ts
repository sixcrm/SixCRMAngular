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
import { LoadBalancerViewComponent } from './load-balancers-page/load-balancer-view/load-balancer-view.component';
import { TransactionViewComponent } from './transactions-page/transaction-view/transaction-view.component';
import { SessionViewComponent } from './sessions-page/session-view/session-view.component';
import { ProductViewComponent } from './products-page/product-view/product-view.component';
import { CreditCardsComponent } from './credit-cards-page/credit-cards.component';
import { CreditCardViewComponent } from './credit-cards-page/credit-card-view/credit-card-view.component';
import { UsersComponent } from './users-page/users.component';
import { UserViewComponent } from './users-page/user-view/user-view.component';

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
    CustomerViewComponent,
    LoadBalancerViewComponent,
    TransactionViewComponent,
    SessionViewComponent,
    ProductViewComponent,
    CreditCardsComponent,
    CreditCardViewComponent,
    UsersComponent,
    UserViewComponent
  ]
})
export class PagesModule {
}
