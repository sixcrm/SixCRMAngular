import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './authentication/auth-guard.service';
import {ErrorPageComponent} from './error-page/error-page.component';
import {DefaultLayoutComponent} from './navigation/layouts/default/default.layout.component';
import {ComingSoonComponent} from './shared/components/coming-soon/coming-soon.component';
import {TermsAndConditionsGuard} from './authentication/terms-and-conditions-guard.service';

const appRoutes: Routes = [
  { path : '', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : '404', component : ErrorPageComponent },
  { path : '', component : DefaultLayoutComponent, children : [
    { path : '', loadChildren : './pages/search-page/search.module#SearchModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'dashboard', loadChildren : './pages/dashboard-page/dashboard.module#DashboardModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'profile', loadChildren : './pages/profile-page/profile-page.module#ProfilePageModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'notifications', loadChildren : './pages/notifications-page/notifications.module#NotificationsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'affiliates', loadChildren : './pages/affiliates-page/affiliates.module#AffiliatesModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'accounts', loadChildren : './pages/accounts-page/accounts.module#AccountsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'campaigns', loadChildren : './pages/campaigns-page/campaigns.module#CampaignsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'creditcards', loadChildren : './pages/credit-cards-page/credit-cards.module#CreditCardsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'customers', loadChildren : './pages/customers-page/customers.module#CustomersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'fulfillmentproviders', loadChildren : './pages/fulfillment-providers/fulfillment-providers.module#FulfillmentProvidersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'loadbalancers', loadChildren : './pages/load-balancers-page/load-balancers.module#LoadBalancersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'merchantproviders', loadChildren : './pages/merchant-providers-page/merchant-providers.module#MerchantProvidersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'productschedules', loadChildren : './pages/product-schedule-page/product-schedules.module#ProductSchedulesModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'products', loadChildren : './pages/products-page/products.module#ProductsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'rebills', loadChildren : './pages/rebills-page/rebills.module#RebillsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'sessions', loadChildren : './pages/sessions-page/sessions.module#SessionsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'smtpproviders', loadChildren : './pages/smtp-providers-page/smtp-providers.module#SmtpProvidersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'transactions', loadChildren : './pages/transactions-page/transactions.module#TransactionsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'users', loadChildren : './pages/users-page/users.module#UsersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'trackers', loadChildren : './pages/trackers-page/trackers.module#TrackersModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'emailtemplates', loadChildren : './pages/email-templates-page/email-templates.module#EmailTemplatesModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'reports', loadChildren : './reports/reports.module#ReportsModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'documentation', loadChildren : './pages/documentation/documentation.module#DocumentationModule', canActivate: [AuthGuard, TermsAndConditionsGuard] },
    { path : 'coming-soon', component: ComingSoonComponent },
    { path : 'roles', component: ComingSoonComponent },
    { path : 'billing', component: ComingSoonComponent },
    { path : '**', component : ErrorPageComponent }
  ]},

];



export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
