import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './authentication/auth-guard.service';
import {ErrorPageComponent} from './error-page/error-page.component';
import {DefaultLayoutComponent} from './navigation/layouts/default/default.layout.component';
import {ComingSoonComponent} from './shared/components/coming-soon/coming-soon.component';
import {ErrorPageStandaloneComponent} from './error-page-standalone/error-page-standalone.component';
import {BillingDisabledGuard} from './authentication/payment-dissabled-guard.service';
import {BillingInfoComponent} from './billing-info/billing-info.component';
import {MasterAccountGuard} from "./authentication/master-account-guard.service";

const appRoutes: Routes = [
  { path : '', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : 'payment', loadChildren : './payment/payment.module#PaymentModule', canActivate: [AuthGuard] },
  { path : '404', component : ErrorPageStandaloneComponent },
  { path : '', component : DefaultLayoutComponent, children : [
    { path : 'search', loadChildren : './pages/search-page/search.module#SearchModule', canActivate: [AuthGuard] },
    { path : 'dashboard', loadChildren : './pages/dashboard-page/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
    { path : 'state-machine',
      loadChildren : './pages/state-machine-page/state-machine.module#StateMachineModule', canActivate: [AuthGuard] },
    { path : 'profile', loadChildren : './pages/profile-page/profile-page.module#ProfilePageModule', canActivate: [AuthGuard] },
    { path : 'notifications', loadChildren : './pages/notifications-page/notifications.module#NotificationsModule', canActivate: [AuthGuard] },
    { path : 'affiliates', loadChildren : './pages/affiliates-page/affiliates.module#AffiliatesModule', canActivate: [AuthGuard] },
    { path : 'accounts', loadChildren : './pages/accounts-page/accounts.module#AccountsModule', canActivate: [AuthGuard] },
    { path : 'accountmanagement', loadChildren : './pages/account-management-page/account-management.module#AccountManagementModule', canActivate: [AuthGuard] },
    { path : 'bills', loadChildren : './pages/bills-page/bills.module#BillsModule', canActivate: [AuthGuard] },
    { path : 'campaigns', loadChildren : './pages/campaigns-page/campaigns.module#CampaignsModule', canActivate: [AuthGuard] },
    { path : 'creditcards', loadChildren : './pages/credit-cards-page/credit-cards.module#CreditCardsModule', canActivate: [AuthGuard] },
    { path : 'customers', loadChildren : './pages/customers-page/customers.module#CustomersModule', canActivate: [AuthGuard] },
    { path : 'customer-advanced', loadChildren : './pages/customer-advanced-page/customer-advanced.module#CustomerAdvancedModule', canActivate: [AuthGuard] },
    { path : 'customer-service', loadChildren : './pages/customer-service-page/customer-service.module#CustomerServiceModule', canActivate: [AuthGuard] },
    { path : 'eventhooks', loadChildren : './pages/event-hooks-page/event-hooks.module#EventHooksModule', canActivate: [AuthGuard] },
    { path : 'fulfillmentproviders', loadChildren : './pages/fulfillment-providers/fulfillment-providers.module#FulfillmentProvidersModule', canActivate: [AuthGuard] },
    { path : 'merchantprovidergroups', loadChildren : './pages/merchant-provider-groups-page/merchant-provider-groups.module#MerchantProviderGroupsModule', canActivate: [AuthGuard] },
    { path : 'merchantproviders', loadChildren : './pages/merchant-providers-page/merchant-providers.module#MerchantProvidersModule', canActivate: [AuthGuard] },
    { path : 'productschedules', loadChildren : './pages/product-schedule-page/product-schedules.module#ProductSchedulesModule', canActivate: [AuthGuard] },
    { path : 'products', loadChildren : './pages/products-page/products.module#ProductsModule', canActivate: [AuthGuard] },
    { path : 'rebills', loadChildren : './pages/rebills-page/rebills.module#RebillsModule', canActivate: [AuthGuard] },
    { path : 'sessions', loadChildren : './pages/sessions-page/sessions.module#SessionsModule', canActivate: [AuthGuard] },
    { path : 'shippingreceipts', loadChildren : './pages/shipping-receipts-page/shipping-receipts.module#ShippingReceiptsModule', canActivate: [AuthGuard] },
    { path : 'smtpproviders', loadChildren : './pages/smtp-providers-page/smtp-providers.module#SmtpProvidersModule', canActivate: [AuthGuard] },
    { path : 'transactions', loadChildren : './pages/transactions-page/transactions.module#TransactionsModule', canActivate: [AuthGuard] },
    { path : 'users', loadChildren : './pages/users-page/users.module#UsersModule', canActivate: [AuthGuard] },
    { path : 'trackers', loadChildren : './pages/trackers-page/trackers.module#TrackersModule', canActivate: [AuthGuard] },
    { path : 'emailtemplates', loadChildren : './pages/email-templates-page/email-templates.module#EmailTemplatesModule', canActivate: [AuthGuard] },
    { path : 'reports', loadChildren : './reports/reports.module#ReportsModule', canActivate: [AuthGuard] },
    { path : 'documentation', loadChildren : './pages/documentation/documentation.module#DocumentationModule', canActivate: [AuthGuard] },
    { path : 'coming-soon', component: ComingSoonComponent, canActivate: [AuthGuard] },
    { path : 'roles', loadChildren : './pages/roles-page/roles.module#RolesModule', canActivate: [AuthGuard] },
    { path : 'features', loadChildren : './pages/features-page/features.module#FeaturesModule', canActivate: [MasterAccountGuard] },
    { path : 'billing-disabled', component : BillingInfoComponent, canActivate: [BillingDisabledGuard] },
    { path : '**', component : ErrorPageComponent, canActivate: [AuthGuard] }
  ]},

];



export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
