import {MenuItem} from './menu-item';
import {AuthenticationService} from '../authentication/authentication.service';
import {Acl} from '../shared/models/acl.model';
import {FeatureFlagService} from "../shared/services/feature-flag.service";

export function menuItems(authService: AuthenticationService, acl: Acl, featureFlagService: FeatureFlagService): MenuItem[] {
  let items: MenuItem[] = [];

  // Add dashboard
  if (acl && acl.role.name === 'Customer Service') {
    items.push(new MenuItem('SIDENAV_DASHBOARD', 'customer-service').setIcon('headset_mic'));
  } else {
    items.push(new MenuItem('SIDENAV_DASHBOARD', 'dashboard').setIcon('home'));
  }

  if (featureFlagService.isEnabled('state-machine') && acl && acl.role.name !== 'Customer Service') {
    items.push(new MenuItem('SIDENAV_ORDERENGINE', 'state-machine').setIcon('device_hub'));
  }

  // Add Order items
  let orderItems: MenuItem[] = [];

  if (authService.hasPermissions('customer', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_CUSTOMER', 'customers'));
  }
  if (authService.hasPermissions('creditcard', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_CREDITCARD', 'creditcards'));
  }
  if (authService.hasPermissions('session', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_SESSION', 'sessions'));
  }
  if (authService.hasPermissions('transaction', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_TRANSACTION', 'transactions'));
  }
  if (authService.hasPermissions('rebill', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_REBILL', 'rebills'));
  }
  if (authService.hasPermissions('shippingreceipt', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_SHIPPINGRECEIPT', 'shippingreceipts'));
  }
  if (featureFlagService.isEnabled('orders|pending-rebills') && authService.hasPermissions('rebill', 'read') || authService.isBillingDisabled()) {
    orderItems.push(new MenuItem('SIDENAV_ORDER_PENDINGREBILL', 'rebills/pending'));
  }

  if (orderItems.length > 0) {
    items.push(new MenuItem('SIDENAV_ORDER_TITLE', null, orderItems).setIcon('payment'));
  }

  // Add reports
  let reportItems: MenuItem[] = [];
  let cycle: MenuItem[] = [];
  if (featureFlagService.isEnabled('cycle-reports|day-to-day') && (authService.hasPermissions('analytics', 'getDayToDay') || authService.isBillingDisabled())) {
    cycle.push(new MenuItem('SIDENAV_REPORTS_CYCLE_DAYTODAY', 'reports/daytoday'))
  }
  if (featureFlagService.isEnabled('cycle-reports|cycle') && (authService.hasPermissions('analytics', 'getCycleReport') || authService.isBillingDisabled())) {
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
    items.push(new MenuItem('SIDENAV_REPORTS_TITLE', null, reportItems).setIcon('insert_chart'));
  }

  // Add CRM menu items
  if (featureFlagService.isEnabled('crm-setup')) {

    let crmItems: MenuItem[] = [];
    if (authService.hasPermissions('campaign', 'read') || authService.isBillingDisabled()) {
      crmItems.push(new MenuItem('SIDENAV_CRM_CAMPAIGN', 'campaigns'));
    }
    if (authService.hasPermissions('product', 'read') || authService.isBillingDisabled()) {
      crmItems.push(new MenuItem('SIDENAV_CRM_PRODUCT', 'products'));
    }
    if (authService.hasPermissions('productschedule', 'read') || authService.isBillingDisabled()) {
      crmItems.push(new MenuItem('SIDENAV_CRM_PRODUCTSCHEDULE', 'productschedules'));
    }
    if (authService.hasPermissions('emailtemplate', 'read') || authService.isBillingDisabled()) {
      crmItems.push(new MenuItem('SIDENAV_CRM_EMAILTEMPLATE', 'emailtemplates'));
    }

    if (featureFlagService.isEnabled('crm-setup|event-hooks') && (authService.hasPermissions('eventhook', 'read') || authService.isBillingDisabled())) {
      crmItems.push(new MenuItem('SIDENAV_CRM_EVENTHOOK', 'eventhooks'));
    }

    let tracking: MenuItem[] = [];
    if (authService.hasPermissions('affiliate', 'read') || authService.isBillingDisabled()) {
      tracking.push(new MenuItem('SIDENAV_CRM_TRAFFIC_AFFILIATE', 'affiliates'));
    }
    if (authService.hasPermissions('tracker', 'read') || authService.isBillingDisabled()) {
      tracking.push(new MenuItem('SIDENAV_CRM_TRAFFIC_TRACKER', 'trackers'));
    }
    if (tracking.length > 0) {
      crmItems.push(new MenuItem('SIDENAV_CRM_TRAFFIC_TITLE', null, tracking));
    }

    // Add Merchants menu item
    let merchants: MenuItem[] = [];
    if (authService.hasPermissions('merchantprovider', 'read') || authService.isBillingDisabled()) {
      merchants.push(new MenuItem('SIDENAV_CRM_MERCHANT_MERCHANTPROVIDER', 'merchantproviders'))
    }
    if (authService.hasPermissions('merchantprovidergroup', 'read') || authService.isBillingDisabled()) {
      merchants.push(new MenuItem('SIDENAV_CRM_MERCHANT_MERCHANTPROVIDERGROUP', 'merchantprovidergroups'))
    }
    if (merchants.length > 0) {
      crmItems.push(new MenuItem('SIDENAV_CRM_MERCHANT_TITLE', null, merchants));
    }

    // Add 3rd party providers to CRM menu
    let thirdPartyProviders: MenuItem[] = [];
    if (authService.hasPermissions('fulfillmentprovider', 'read') || authService.isBillingDisabled()) {
      thirdPartyProviders.push(new MenuItem('SIDENAV_CRM_PROVIDERS_FULFILLMENT', 'fulfillmentproviders'))
    }
    if (authService.hasPermissions('smtpprovider', 'read') || authService.isBillingDisabled()) {
      thirdPartyProviders.push(new MenuItem('SIDENAV_CRM_PROVIDERS_SMTP', 'smtpproviders'))
    }
    if (thirdPartyProviders.length > 0) {
      crmItems.push(new MenuItem('SIDENAV_CRM_PROVIDERS_TITLE', null, thirdPartyProviders));
    }

    if (crmItems.length > 0) {
      items.push(new MenuItem('SIDENAV_CRM_TITLE', null, crmItems).setIcon('apps'));
    }

  }

  // Add Account Management menu item
  let accountManagement: MenuItem[] = [];

  if (featureFlagService.isEnabled('account-management')) {
    if (authService.hasPermissions('account', 'read')) {
      accountManagement.push(new MenuItem('SIDENAV_ACCOUNTMANAGEMENT_GENERAL', 'accountmanagement/general'));
    }
    if (authService.hasPermissions('billing', 'read')) {
      accountManagement.push(new MenuItem('SIDENAV_ACCOUNTMANAGEMENT_BILLING', 'accountmanagement/billing'));
    }
    if (authService.hasPermissions('useracl', 'read')) {
      accountManagement.push(new MenuItem('SIDENAV_ACCOUNTMANAGEMENT_USERS', 'accountmanagement/users'));
    }
    if (authService.hasPermissions('role', 'read')) {
      accountManagement.push(new MenuItem('SIDENAV_ACCOUNTMANAGEMENT_ROLES', 'accountmanagement/roles'));
    }
    if (authService.hasPermissions('accesskey', 'read')) {
      accountManagement.push(new MenuItem('SIDENAV_ACCOUNTMANAGEMENT_KEYS', 'accountmanagement/apikeys'));
    }

    if (accountManagement.length > 0) {
      items.push(new MenuItem('SIDENAV_ACCOUNTMANAGEMENT_TITLE', null, accountManagement).setIcon('settings'));
    }
  }

  if (authService.isActiveOrActingAclMasterAccount()) {
    // Add Settings menu item
    let settings: MenuItem[] = [];

    settings.push(new MenuItem('SIDENAV_SETTINGS_ACCOUNT', 'accounts'));

    settings.push(new MenuItem('SIDENAV_SETTINGS_USER', 'users'));

    settings.push(new MenuItem('SIDENAV_SETTINGS_ROLE', 'roles'));

    settings.push(new MenuItem('SIDENAV_SETTINGS_BILL', 'bills'));

    settings.push(new MenuItem('Features', 'features'));

    items.push(
      new MenuItem('SIDENAV_SETTINGS_TITLE', null, settings)
        .setImage('/assets/images/logo-navigation-sidenav.svg')
        .setSeparator(true)
    );
  }

  return items;
}
