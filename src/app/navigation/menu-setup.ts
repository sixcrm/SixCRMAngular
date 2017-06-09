import {MenuItem} from './menu-item';
import {AuthenticationService} from '../authentication/authentication.service';
import {Acl} from '../shared/models/acl.model';

export function menuItems(authService: AuthenticationService, acl: Acl): MenuItem[] {
  let items: MenuItem[] = [];

  // Add dashboard
  if (acl && acl.role.name == 'Customer Service') {
    items.push(new MenuItem('Dashboard', 'customer-service-dashboard').setIcon('headset_mic'));
  } else {
    items.push(new MenuItem('Dashboard', 'dashboard').setIcon('view_quilt'));
  }
  // Add reports

  let reportItems: MenuItem[] = [];
  if (authService.hasPermissions('analytics', 'getOrders')) {
    reportItems.push(new MenuItem('Order Report', 'reports/order'));
  }

  if (authService.hasPermissions('analytics', 'getTransactions')) {
    reportItems.push(new MenuItem('Transactions Report', 'reports/transaction'));
  }

  if (authService.hasPermissions('analytics', 'getFullfillment')) {
    reportItems.push(new MenuItem('Fulfillment Report', 'reports/fulfillment'));
  }

  if (authService.hasPermissions('analytics', 'getAffiliates')) {
    reportItems.push(new MenuItem('Affiliate Report', 'reports/affiliate'));
  }

  if (authService.hasPermissions('analytics', 'getRetention')) {
    reportItems.push(new MenuItem('Retention', 'reports/retention'));
  }

  if (authService.hasPermissions('analytics', 'getProjections')) {
    reportItems.push(new MenuItem('Projections', 'reports/projection'));
  }

  if (reportItems.length > 0) {
    items.push(new MenuItem('Reports', null, reportItems).setIcon('library_books'));
  }

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
    crmItems.push(new MenuItem('Campaigns', 'campaigns'));
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

  settings.push(new MenuItem('Documentation', null, [new MenuItem('GraphQL', 'documentation/graph')]));
  items.push(new MenuItem('Settings', null, settings).setIcon('settings'));

  // Add Search menu item
  if (acl.role.name !== 'Customer Service') {
    items.push(new MenuItem('Search', 'search').setIcon('search'));
  }

  return items;
}
