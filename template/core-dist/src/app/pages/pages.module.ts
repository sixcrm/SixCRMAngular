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
import { CreditCardsComponent } from './credit-cards-page/credit-cards.component';
import { UsersComponent } from './users-page/users.component';
import { SmtpProvidersComponent } from './smtp-providers-page/smtp-providers.component';
import { EmailsComponent } from './emails-page/emails.component';
import { AccessKeysComponent } from './access-keys-page/access-keys.component';
import { DashboardComponent } from './dashboard-page/dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { SearchComponent } from './search-page/search.component';
import { UserComponent } from './users-page/user/user.component';
import { ProductComponent } from './products-page/product/product.component';
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
import { TableActionsComponent } from './components/table-actions/table-actions.component';
import { TablePaginationComponent } from './components/table-pagination/table-pagination.component';
import { TransactionComponent } from './transactions-page/transaction/transaction.component';
import { MerchantProviderComponent } from './merchant-providers-page/merchant-provider/merchant-provider.component';
import { LoadBalancerComponent } from './load-balancers-page/load-balancer/load-balancer.component';
import { AffiliateComponent } from './affiliates-page/affiliate/affiliate.component';
import { SessionComponent } from './sessions-page/session/session.component';
import { CustomerComponent } from './customers-page/customer/customer.component';
import { CreditCardComponent } from './credit-cards-page/credit-card/credit-card.component';
import { SmtpProviderComponent } from './smtp-providers-page/smtp-provider/smtp-provider.component';
import { FulfillmentProviderComponent } from './fulfillment-providers/fulfillment-provider/fulfillment-provider.component';
import { EmailComponent } from './emails-page/email/email.component';
import { CampaignComponent } from './campaigns-page/campaign/campaign.component';
import {ProductScheduleComponent} from './product-schedule-page/product-schedule/product-schedule.component';
import {ProductSchedulesComponent} from './product-schedule-page/product-schedules.component';
import {EntityViewTopnavComponent} from './components/entity-view-topnav/entity-view-topnav.component';
import {EntityViewInfoComponent} from './components/entity-view-info/entity-view-info.component';
import { EntityViewInfoArrayComponent } from './components/entity-view-info-array/entity-view-info-array.component';
import { ResultItemComponent } from './search-page/result-item/result-item.component';
import { ResultItemDetailsComponent } from './search-page/result-item-details/result-item-details.component';
import { ProductViewComponent } from './products-page/product-view/product-view.component';
import { CampaignViewComponent } from './campaigns-page/campaign-view/campaign-view.component';
import { CustomerViewComponent } from './customers-page/customer-view/customer-view.component';
import { UserViewComponent } from './users-page/user-view/user-view.component';
import { TransactionViewComponent } from './transactions-page/transaction-view/transaction-view.component';
import { FulfillmentViewComponent } from './fulfillment-providers/fulfillment-view/fulfillment-view.component';
import { ProductScheduleViewComponent } from './product-schedule-page/product-schedule-view/product-schedule-view.component';
import { CreditCardViewComponent } from './credit-cards-page/credit-card-view/credit-card-view.component';
import { MerchantProviderViewComponent } from './merchant-providers-page/merchant-provider-view/merchant-provider-view.component';
import { LoadBalancerViewComponent } from './load-balancers-page/load-balancer-view/load-balancer-view.component';
import { AffiliateViewComponent } from './affiliates-page/affiliate-view/affiliate-view.component';
import { SessionViewComponent } from './sessions-page/session-view/session-view.component';

@NgModule({
  imports : [
    pagesRouting,
    SharedModule,
    NavigationModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  declarations : [
    ProfilePageComponent,
    CampaignsComponent,
    ProductsComponent,
    ProductSchedulesComponent,
    MerchantProvidersComponent,
    FulfillmentProvidersComponent,
    AffiliatesComponent,
    CustomersComponent,
    SessionsComponent,
    LoadBalancersComponent,
    TransactionsComponent,
    CreditCardsComponent,
    UsersComponent,
    SmtpProvidersComponent,
    EmailsComponent,
    AccessKeysComponent,
    DashboardComponent,
    SearchComponent,
    UserComponent,
    ProductComponent,
    TableActionsComponent,
    TablePaginationComponent,
    TransactionComponent,
    MerchantProviderComponent,
    LoadBalancerComponent,
    AffiliateComponent,
    ProductScheduleComponent,
    SessionComponent,
    CustomerComponent,
    CreditCardComponent,
    SmtpProviderComponent,
    FulfillmentProviderComponent,
    EmailComponent,
    CampaignComponent,
    EntityViewTopnavComponent,
    EntityViewInfoComponent,
    EntityViewInfoArrayComponent,
    ResultItemComponent,
    ResultItemDetailsComponent,
    ProductViewComponent,
    CampaignViewComponent,
    CustomerViewComponent,
    UserViewComponent,
    TransactionViewComponent,
    FulfillmentViewComponent,
    ProductScheduleViewComponent,
    CreditCardViewComponent,
    MerchantProviderViewComponent,
    LoadBalancerViewComponent,
    AffiliateViewComponent,
    SessionViewComponent
  ],
  providers: [
    UsersAclGuard,
    ProductsAclGuard,
    CampaignsAclGuard,
    ProductSchedulesAclGuard,
    MerchantProvidersAclGuard,
    FulfillmentProvidersAclGuard,
    AffiliatesAclGuard,
    CustomersAclGuard,
    SessionsAclGuard,
    LoadBalancersAclGuard,
    TransactionsAclGuard,
    CreditCardsAclGuard,
    SmtpProvidersAclGuard,
    EmailsAclGuard
  ]
})
export class PagesModule {
}
