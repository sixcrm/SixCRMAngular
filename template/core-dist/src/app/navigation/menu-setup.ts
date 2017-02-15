import {MenuItem} from './menu-item';

export const menuItemSetupBackup: MenuItem[] = [
  new MenuItem('Campaigns', 'campaigns'),
  new MenuItem('Products', 'products'),
  new MenuItem('Merchant Providers', 'merchantProviders'),
  new MenuItem('Fulfillment Providers', 'fulfillmentProviders'),
  new MenuItem('Affiliates', 'affiliates'),
  new MenuItem('Customers', 'customers'),
  new MenuItem('Sessions', 'sessions'),
  new MenuItem('Load Balancers', 'loadBalancers'),
  new MenuItem('Transactions', 'transactions'),
  new MenuItem('Users', 'users'),
  new MenuItem('Credit Cards', 'creditCards'),
  new MenuItem('Emails', 'emails'),
  new MenuItem('SMTP Providers', 'smtpProviders'),
  new MenuItem('Access Keys', 'accessKeys'),
];

export const menuItemSetup: MenuItem[] = [
  new MenuItem('Dashboard', 'dashboard').setIcon('view_quilt'),

  new MenuItem('Reports', null, [
    new MenuItem('Order Report', ''),
    new MenuItem('Transactions Report', 'transactions'),
    new MenuItem('Fulfillment Report', ''),
    new MenuItem('Affiliate Report', ''),
    new MenuItem('Retention', ''),
    new MenuItem('Projections', ''),
  ]).setIcon('library_books'),

  new MenuItem('Customers', null, [
    new MenuItem('Customers', 'customers'),
    new MenuItem('Credit Cards', 'creditCards')
  ]).setIcon('account_box'),

  new MenuItem('CRM', null, [
    new MenuItem('Products', 'products'),
    new MenuItem('Product Schedules', 'productSchedule'),
    new MenuItem('Campaigns', null, [
      new MenuItem('Campaigns', 'campaigns'),
      new MenuItem('Emails', 'emails'),
    ]),
    new MenuItem('Affiliates', 'affiliates'),
    new MenuItem('3rd Party Providers', null, [
      new MenuItem('Fulfillment Providers', 'fulfillmentProviders'),
      new MenuItem('SMTP Providers', 'smtpProviders'),
    ]),
  ]).setIcon('account_balance'),

  new MenuItem('Merchants', null, [
    new MenuItem('Merchant Providers', 'merchantProviders'),
    new MenuItem('Load Balancers', 'loadBalancers'),
  ]).setIcon('payment'),

  new MenuItem('Settings', null, [
    new MenuItem('Users', 'users'),
    new MenuItem('Access Rules', ''),
    new MenuItem('Billing', ''),
  ]).setIcon('extension'),
];
