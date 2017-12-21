import {MenuItem} from './menu-item';
import {AuthenticationService} from '../authentication/authentication.service';
import {Acl} from '../shared/models/acl.model';

export function menuItems(authService: AuthenticationService, acl: Acl): MenuItem[] {
  let items: MenuItem[] = [];

  // Add dashboard
  if (acl && acl.role.name === 'Customer Service') {
    items.push(new MenuItem('SIDENAV_DASHBOARD', 'customer-service-dashboard').setIcon('headset_mic'));
  } else {
    items.push(new MenuItem('SIDENAV_DASHBOARD', 'dashboard').setIcon('view_quilt'));
  }

  if (acl && acl.role.name !== 'Customer Service') {
    items.push(new MenuItem('SIDENAV_ORDERENGINE', 'state-machine').setIcon('device_hub'));
  }

  // Add reports
  let reportItems: MenuItem[] = [];
  if (authService.hasPermissions('analytics', 'getOrders')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_ORDER', 'reports/order'));
  }

  if (authService.hasPermissions('analytics', 'getTransactions')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_SUMMARY', 'reports/summary'));
  }

  if (authService.hasPermissions('analytics', 'getTransactions')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_TRANSACTION', 'reports/transaction'));
  }

  if (authService.hasPermissions('analytics', 'getMerchants')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_MERCHANT', 'reports/merchant'));
  }

  if (authService.hasPermissions('analytics', 'getAffiliates')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_AFFILIATE', 'reports/affiliate'));
  }

  if (authService.hasPermissions('analytics', 'getFullfillment')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_FULFILLMENT', 'reports/fulfillment'));
  }

  if (authService.hasPermissions('analytics', 'getRetention')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_RETENTION', 'reports/retention'));
  }

  if (authService.hasPermissions('analytics', 'getProjections')) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_PROJECTION', 'reports/projection'));
  }

  if (reportItems.length > 0) {
    items.push(new MenuItem('SIDENAV_REPORTS_TITLE', null, reportItems).setIcon('library_books'));
  }

  // Add customer menu items
  items.push(new MenuItem('SIDENAV_CUSTOMER', 'customers').setIcon('account_box'));

  // Add CRM menu items
  let crmItems: MenuItem[] = [];
  if (authService.hasPermissions('product', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_PRODUCT', 'products'));
  }
  if (authService.hasPermissions('productschedule', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_PRODUCTSCHEDULE', 'productschedules'));
  }
  if (authService.hasPermissions('campaign', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_CAMPAIGN', 'campaigns'));
  }
  if (authService.hasPermissions('emailtemplate', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_EMAILTEMPLATE', 'emailtemplates'));
  }
  if (authService.hasPermissions('affiliate', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_AFFILIATE', 'affiliates'));
  }
  if (authService.hasPermissions('tracker', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_TRACKER', 'trackers'));
  }
  if (authService.hasPermissions('session', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_SESSION', 'sessions'));
  }
  if (authService.hasPermissions('transaction', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_TRANSACTION', 'transactions'));
  }
  if (authService.hasPermissions('rebill', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_REBILL', 'rebills'));
  }
  if (authService.hasPermissions('shippingreceipt', 'view')) {
    crmItems.push(new MenuItem('SIDENAV_CRM_SHIPPINGRECEIPT', 'shippingreceipts'));
  }

  // Add 3rd party providers to CRM menu
  let thirdPartyProviders: MenuItem[] = [];
  if (authService.hasPermissions('fulfillmentprovider', 'view')) {
    thirdPartyProviders.push(new MenuItem('SIDENAV_CRM_PROVIDERS_FULFILLMENT', 'fulfillmentproviders'))
  }
  if (authService.hasPermissions('smtpprovider', 'view')) {
    thirdPartyProviders.push(new MenuItem('SIDENAV_CRM_PROVIDERS_SMTP', 'smtpproviders'))
  }
  if (thirdPartyProviders.length > 0) {
    crmItems.push(new MenuItem('SIDENAV_CRM_PROVIDERS_TITLE', null, thirdPartyProviders));
  }

  if (crmItems.length > 0) {
    items.push(new MenuItem('SIDENAV_CRM_TITLE', null, crmItems).setIcon('account_balance'));
  }

  // Add Merchants menu item
  let merchants: MenuItem[] = [];
  if (authService.hasPermissions('merchantprovider', 'view')) {
    merchants.push(new MenuItem('SIDENAV_MERCHANT_MERCHANTPROVIDER', 'merchantproviders'))
  }
  if (authService.hasPermissions('loadbalancer', 'view')) {
    merchants.push(new MenuItem('SIDENAV_MERCHANT_LOADBALANCER', 'loadbalancers'))
  }

  if (merchants.length > 0) {
    items.push(new MenuItem('SIDENAV_MERCHANT_TITLE', null, merchants).setIcon('payment'));
  }

  // Add Settings menu item
  let settings: MenuItem[] = [];
  if (authService.hasPermissions('user', 'view') && authService.isActiveAclMasterAccount()) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_USER', 'users'));
  }
  if (authService.hasPermissions('account', 'view')) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_ACCOUNT', 'accounts'));
  }
  if (authService.hasPermissions('bill', 'view') && authService.isActiveAclMasterAccount()) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_BILL', 'bills'));
  }
  if (authService.hasPermissions('role', 'view')) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_ROLE', 'roles'));
  }

  settings.push(new MenuItem('SIDENAV_SETTINGS_DOCUMENTATION_TITLE', null, [
    new MenuItem('SIDENAV_SETTINGS_DOCUMENTATION_GRAPHQL', 'documentation/graph'),
    new MenuItem({title: 'SIDENAV_SETTINGS_DOCUMENTATION_WIKI', clickHandler: () => window.open('https://github.com/sixcrm/SixCRMIntegrations/wiki', '_blank').focus()}, '')
  ]));
  items.push(new MenuItem('SIDENAV_SETTINGS_TITLE', null, settings).setIcon('settings'));

  // Add Search menu item
  if (acl.role.name !== 'Customer Service') {
    items.push(new MenuItem('SIDENAV_SEARCH', 'search').setIcon('search'));
  }

  return items;
}
