import {MenuItem} from './menu-item';
import {AuthenticationService} from '../authentication/authentication.service';
import {Acl} from '../shared/models/acl.model';

export function menuItems(authService: AuthenticationService, acl: Acl): MenuItem[] {
  let items: MenuItem[] = [];

  // Add dashboard
  if (acl && acl.role.name === 'Customer Service') {
    items.push(new MenuItem('SIDENAV_DASHBOARD', 'customer-service').setIcon('headset_mic'));
  } else {
    items.push(new MenuItem('SIDENAV_DASHBOARD', 'dashboard').setIcon('view_quilt'));
  }

  if (acl && acl.role.name !== 'Customer Service') {
    items.push(new MenuItem('SIDENAV_ORDERENGINE', 'state-machine').setIcon('device_hub'));
  }

  // Add Order items
  let orderItems: MenuItem[] = [];

  if (authService.hasPermissions('customer', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_CUSTOMER', 'customers'));
  }
  if (authService.hasPermissions('creditcard', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_CREDITCARD', 'creditcards'));
  }
  if (authService.hasPermissions('session', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_SESSION', 'sessions'));
  }
  if (authService.hasPermissions('transaction', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_TRANSACTION', 'transactions'));
  }
  if (authService.hasPermissions('rebill', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_REBILL', 'rebills'));
  }
  if (authService.hasPermissions('shippingreceipt', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_SHIPPINGRECEIPT', 'shippingreceipts'));
  }
  if (authService.hasPermissions('rebill', 'view') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_PENDINGREBILL', 'rebills/pending'));
  }

  if (orderItems.length > 0) {
    items.push(new MenuItem('SIDENAV_ORDER_TITLE', null, orderItems).setIcon('payment'));
  }

  // Add reports
  let reportItems: MenuItem[] = [];
  let cycle: MenuItem[] = [];
  if (authService.hasPermissions('analytics', 'getDayToDay') || authService.isBillingDisabled()) {
    cycle.push(new MenuItem('SIDENAV_REPORTS_CYCLE_DAYTODAY', 'reports/daytoday'))
  }
  if (authService.hasPermissions('analytics', 'getCycleReport') || authService.isBillingDisabled()) {
    cycle.push(new MenuItem('SIDENAV_REPORTS_CYCLE_CYCLE', 'reports/cycle'))
  }
  if (cycle.length > 0) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_CYCLE_TITLE', null, cycle));
  }

  let traffic: MenuItem[] = [];
  if (authService.hasPermissions('analytics', 'getAffiliates') || authService.isBillingDisabled()) {
    traffic.push(new MenuItem('SIDENAV_REPORTS_TRAFFIC_AFFILIATE', 'reports/affiliate'));
  }
  if (authService.hasPermissions('analytics', 'getMerchants') || authService.isBillingDisabled()) {
    traffic.push(new MenuItem('SIDENAV_REPORTS_TRAFFIC_MERCHANT', 'reports/merchant'));
  }
  if (traffic.length > 0) {
    reportItems.push(new MenuItem('SIDENAV_REPORTS_TRAFFIC_TITLE', null, traffic));
  }

  if (reportItems.length > 0) {
    items.push(new MenuItem('SIDENAV_REPORTS_TITLE', null, reportItems).setIcon('library_books'));
  }

  // Add CRM menu items
  let crmItems: MenuItem[] = [];
  if (authService.hasPermissions('campaign', 'view') || authService.isBillingDisabled()) {
    crmItems.push(new MenuItem('SIDENAV_CRM_CAMPAIGN', 'campaigns'));
  }
  if (authService.hasPermissions('product', 'view') || authService.isBillingDisabled()) {
    crmItems.push(new MenuItem('SIDENAV_CRM_PRODUCT', 'products'));
  }
  if (authService.hasPermissions('productschedule', 'view') || authService.isBillingDisabled()) {
    crmItems.push(new MenuItem('SIDENAV_CRM_PRODUCTSCHEDULE', 'productschedules'));
  }
  if (authService.hasPermissions('emailtemplate', 'view') || authService.isBillingDisabled()) {
    crmItems.push(new MenuItem('SIDENAV_CRM_EMAILTEMPLATE', 'emailtemplates'));
  }

  if (authService.hasPermissions('eventhook', 'view') || authService.isBillingDisabled()) {
    crmItems.push(new MenuItem('SIDENAV_CRM_EVENTHOOK', 'eventhooks'));
  }

  let tracking: MenuItem[] = [];
  if (authService.hasPermissions('affiliate', 'view') || authService.isBillingDisabled()) {
    tracking.push(new MenuItem('SIDENAV_CRM_TRAFFIC_AFFILIATE', 'affiliates'));
  }
  if (authService.hasPermissions('tracker', 'view') || authService.isBillingDisabled()) {
    tracking.push(new MenuItem('SIDENAV_CRM_TRAFFIC_TRACKER', 'trackers'));
  }
  if (tracking.length > 0) {
    crmItems.push(new MenuItem('SIDENAV_CRM_TRAFFIC_TITLE', null, tracking));
  }

  // Add Merchants menu item
  let merchants: MenuItem[] = [];
  if (authService.hasPermissions('merchantprovider', 'view') || authService.isBillingDisabled()) {
    merchants.push(new MenuItem('SIDENAV_CRM_MERCHANT_MERCHANTPROVIDER', 'merchantproviders'))
  }
  if (authService.hasPermissions('merchantprovidergroup', 'view') || authService.isBillingDisabled()) {
    merchants.push(new MenuItem('SIDENAV_CRM_MERCHANT_MERCHANTPROVIDERGROUP', 'merchantprovidergroups'))
  }
  if (merchants.length > 0) {
    crmItems.push(new MenuItem('SIDENAV_CRM_MERCHANT_TITLE', null, merchants));
  }

  // Add 3rd party providers to CRM menu
  let thirdPartyProviders: MenuItem[] = [];
  if (authService.hasPermissions('fulfillmentprovider', 'view') || authService.isBillingDisabled()) {
    thirdPartyProviders.push(new MenuItem('SIDENAV_CRM_PROVIDERS_FULFILLMENT', 'fulfillmentproviders'))
  }
  if (authService.hasPermissions('smtpprovider', 'view') || authService.isBillingDisabled()) {
    thirdPartyProviders.push(new MenuItem('SIDENAV_CRM_PROVIDERS_SMTP', 'smtpproviders'))
  }
  if (thirdPartyProviders.length > 0) {
    crmItems.push(new MenuItem('SIDENAV_CRM_PROVIDERS_TITLE', null, thirdPartyProviders));
  }

  if (crmItems.length > 0) {
    items.push(new MenuItem('SIDENAV_CRM_TITLE', null, crmItems).setIcon('account_balance'));
  }

  // Add Settings menu item
  let settings: MenuItem[] = [];
  if (authService.hasPermissions('account', 'view') || authService.isBillingDisabled()) {
    let accountlink = 'accounts';

    if (authService.getActiveAcl().account && (authService.getActiveAcl().account.id !== '*')) {
      accountlink += '/' + authService.getActiveAcl().account.id;
    }

    settings.push(new MenuItem('SIDENAV_SETTINGS_ACCOUNT', accountlink));
  }
  if (authService.hasPermissions('user', 'view') && authService.isActiveAclMasterAccount()) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_USER', 'users'));
  }
  if (authService.hasPermissions('role', 'view')) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_ROLE', 'roles'));
  }
  if (authService.hasPermissions('bill', 'view') && authService.isActiveAclMasterAccount()) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_BILL', 'bills'));
  }

  let keys = [];
  if (authService.hasPermissions('usersigningstring', 'view') || authService.isBillingDisabled()) {
    keys.push(new MenuItem('SIDENAV_SETTINGS_KEY_SIGNINGSTRING', 'profile#signingstrings'));
  }
  if ((authService.hasPermissions('accesskey', 'view') || authService.isBillingDisabled()) && authService.getActiveAcl().account ) {
    const accesslink = `accounts/${authService.getActiveAcl().account.id}#accesskeys`;
    keys.push(new MenuItem('SIDENAV_SETTINGS_KEY_ACCESSKEY', accesslink));
  }

  if (keys.length > 0) {
    settings.push(new MenuItem('SIDENAV_SETTINGS_KEY_TITLE', null, keys));
  }

  items.push(new MenuItem('SIDENAV_SETTINGS_TITLE', null, settings).setIcon('settings'));

  // Add Account Management menu item
  let accountManagement: MenuItem[] = [];

  if (authService.hasPermissions('account', 'write')) {
    accountManagement.push(new MenuItem('General', 'accountmanagement/general'));
  }
  if (authService.hasPermissions('billing', 'view')) {
    accountManagement.push(new MenuItem('Billing', 'accountmanagement/billing'));
  }
  if (authService.hasPermissions('useracl', 'view')) {
    accountManagement.push(new MenuItem('Users', 'accountmanagement/users'));
  }
  if (authService.hasPermissions('roles', 'view')) {
    accountManagement.push(new MenuItem('Roles', 'accountmanagement/roles'));
  }
  if (authService.hasPermissions('accesskey', 'view')) {
    accountManagement.push(new MenuItem('API Access Kyes', 'accountmanagement/apikeys'));
  }

  items.push(new MenuItem('Account Management', null, accountManagement).setIcon('settings'));

  return items;
}
