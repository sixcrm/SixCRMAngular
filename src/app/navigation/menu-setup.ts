import {MenuItem} from './menu-item';
import {AuthenticationService} from '../authentication/authentication.service';

export function menuItems(authService: AuthenticationService): MenuItem[] {
  let items: MenuItem[] = [];

  // Add dashboard
  items.push(new MenuItem('Dashboard', 'dashboard').setIcon('view_quilt'));

  // Add reports
  items.push(
    new MenuItem('Reports', null, [
      new MenuItem('Order Report', 'reports/order'),
      new MenuItem('Transactions Report', 'reports/transaction'),
      new MenuItem('Fulfillment Report', 'reports/fulfillment'),
      new MenuItem('Affiliate Report', 'reports/affiliate'),
      new MenuItem('Retention', 'reports/retention'),
      new MenuItem('Projections', 'reports/projection')
    ]).setIcon('library_books')
  );

  // Add customer menu items
  items.push(new MenuItem('Customers', 'customers').setIcon('account_box'));

  // Add CRM menu items
  let crmItems: MenuItem[] = [];
  if (authService.hasPermissions('product', 'view')) {
    crmItems.push(new MenuItem('Products', 'products'));
  }
  if (authService.hasPermissions('productschedule', 'view')) {
    crmItems.push(new MenuItem('Product Schedules', 'productschedules'));
  }

  // Add campaign and email menu items to CRM menu
  let campaignItems: MenuItem[] = [];

  if (authService.hasPermissions('campaign', 'view')) {
    campaignItems.push(new MenuItem('Campaigns', 'campaigns'));
  }
  if (authService.hasPermissions('email', 'view')) {
    campaignItems.push(new MenuItem('Emails', ''));
  }

  if (campaignItems.length > 0) {
    crmItems.push(new MenuItem('Campaigns', null, campaignItems));
  }

  if (authService.hasPermissions('affiliate', 'view')) {
    crmItems.push(new MenuItem('Affiliates', 'affiliates'));
  }
  if (authService.hasPermissions('session', 'view')) {
    crmItems.push(new MenuItem('Sessions', 'sessions'));
  }
  if (authService.hasPermissions('transaction', 'view')) {
    crmItems.push(new MenuItem('Transactions', 'transactions'));
  }
  if (authService.hasPermissions('rebill', 'view')) {
    crmItems.push(new MenuItem('Rebills', 'rebills'));
  }

  // Add 3rd party providers to CRM menu
  let thirdPartyProviders: MenuItem[] = [];
  if (authService.hasPermissions('fulfillmentprovider', 'view')) {
    thirdPartyProviders.push(new MenuItem('Fulfillment Providers', 'fulfillmentproviders'))
  }
  if (authService.hasPermissions('smtpprovider', 'view')) {
    thirdPartyProviders.push(new MenuItem('SMTP Providers', 'smtpproviders'))
  }
  if (thirdPartyProviders.length > 0) {
    crmItems.push(new MenuItem('3rd Party Providers', null, thirdPartyProviders));
  }

  if (crmItems.length > 0) {
    items.push(new MenuItem('CRM', null, crmItems).setIcon('account_balance'));
  }

  // Add Merchants menu item
  let merchants: MenuItem[] = [];
  if (authService.hasPermissions('merchantprovider', 'view')) {
    merchants.push(new MenuItem('Merchant Providers', 'merchantproviders'))
  }
  if (authService.hasPermissions('loadbalancer', 'view')) {
    merchants.push(new MenuItem('Load Balancers', 'loadbalancers'))
  }

  if (merchants.length > 0) {
    items.push(new MenuItem('Merchants', null, merchants).setIcon('payment'));
  }

  // Add Settings menu item
  let settings: MenuItem[] = [];
  if (authService.hasPermissions('user', 'view')) {
    settings.push(new MenuItem('Users', 'users'));
  }
  if (authService.hasPermissions('billing', 'view')) {
    settings.push(new MenuItem('Billing', ''));
  }
  if (authService.hasPermissions('accessrule', 'view')) {
    settings.push(new MenuItem('Access Rules', ''));
  }

  if (settings.length > 0) {
    items.push(new MenuItem('Settings', null, settings).setIcon('settings'));
  }

  // Add Search menu item
  items.push(new MenuItem('Search', 'search').setIcon('search'));

  return items;
}
