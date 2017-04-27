import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from './authentication/auth-guard.service';
import {ErrorPageComponent} from './error-page/error-page.component';
import {DefaultLayoutComponent} from './navigation/layouts/default/default.layout.component';

const appRoutes: Routes = [
  { path : '', loadChildren : './authentication/authentication.module#AuthenticationModule' },
  { path : '', component : DefaultLayoutComponent, children : [
    { path : '', loadChildren : './pages/search-page/search.module#SearchModule', canActivate: [AuthGuard] },
    { path : 'dashboard', loadChildren : './pages/dashboard-page/dashboard.module#DashboardModule', canActivate: [AuthGuard] },
    { path : 'profile', loadChildren : './pages/profile-page/profile-page.module#ProfilePageModule', canActivate: [AuthGuard] },
    { path : 'notifications', loadChildren : './pages/notifications-page/notifications.module#NotificationsModule', canActivate: [AuthGuard] },
    { path : 'affiliates', loadChildren : './pages/affiliates-page/affiliates.module#AffiliatesModule', canActivate: [AuthGuard] },
    { path : 'campaigns', loadChildren : './pages/campaigns-page/campaigns.module#CampaignsModule', canActivate: [AuthGuard] },
    { path : 'creditcards', loadChildren : './pages/credit-cards-page/credit-cards.module#CreditCardsModule', canActivate: [AuthGuard] },
    { path : 'customers', loadChildren : './pages/customers-page/customers.module#CustomersModule', canActivate: [AuthGuard] },
    { path : 'fulfillmentproviders', loadChildren : './pages/fulfillment-providers/fulfillment-providers.module#FulfillmentProvidersModule', canActivate: [AuthGuard] },
    { path : 'loadbalancers', loadChildren : './pages/load-balancers-page/load-balancers.module#LoadBalancersModule', canActivate: [AuthGuard] },
    { path : 'merchantproviders', loadChildren : './pages/merchant-providers-page/merchant-providers.module#MerchantProvidersModule', canActivate: [AuthGuard] },
    { path : 'productschedules', loadChildren : './pages/product-schedule-page/product-schedules.module#ProductSchedulesModule', canActivate: [AuthGuard] },
    { path : 'products', loadChildren : './pages/products-page/products.module#ProductsModule', canActivate: [AuthGuard] },
    { path : 'rebills', loadChildren : './pages/rebills-page/rebills.module#RebillsModule', canActivate: [AuthGuard] },
    { path : 'sessions', loadChildren : './pages/sessions-page/sessions.module#SessionsModule', canActivate: [AuthGuard] },
    { path : 'smtpproviders', loadChildren : './pages/smtp-providers-page/smtp-providers.module#SmtpProvidersModule', canActivate: [AuthGuard] },
    { path : 'transactions', loadChildren : './pages/transactions-page/transactions.module#TransactionsModule', canActivate: [AuthGuard] },
    { path : 'users', loadChildren : './pages/users-page/users.module#UsersModule', canActivate: [AuthGuard] },
  ]},
  { path : '**', component : ErrorPageComponent }

];



export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
