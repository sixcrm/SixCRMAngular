import {AuthenticationService} from '../authentication/authentication.service';
import {Acl} from '../shared/models/acl.model';
import {FeatureFlagService} from "../shared/services/feature-flag.service";
import {NavigationMenuSection, NavigationMenuItem} from './navigation-menu/navigation-menu.component';

export function menuItems(authService: AuthenticationService, acl: Acl, featureFlagService: FeatureFlagService): NavigationMenuSection[] {

  const result: NavigationMenuSection[] = [];

  const mainSection: NavigationMenuSection = { subsections: [ ]};

  const mainSub: NavigationMenuSection = { items: [ {label: 'Home', icon: 'home', url: acl && acl.role.isCustomerService() ? 'customer-service' : 'dashboard'} ] };

  if (authService.hasPermissions('customer', 'read') || authService.isBillingDisabled()) {
    mainSub.items.push({label: 'Customers', icon: 'person', url: 'customers'});
    mainSub.items.push({label: 'Subscriptions', icon: 'date_range', url: 'subscriptions'})
  }

  if (authService.isActiveOrActingAclMasterAccount()) {
    const adminSub: NavigationMenuItem =
    {
      label: 'SIX Administration', image: 'logo-navigation-nav.svg',
      children: [
        {label: 'Accounts', url: 'accounts'},
        {label: 'Features', url: 'features'},
        {label: 'Users', url: 'users'},
        {label: 'Roles', url: 'roles'}
      ]
    };

    mainSub.items.unshift(adminSub);
  }

  const salesSub: NavigationMenuSection = { items: [ {label: 'Sales', icon: 'credit_card', children: [] } ] };

  if (authService.hasPermissions('rebill', 'read') || authService.isBillingDisabled()) {
    salesSub.items[0].children.push({label: 'Orders', url: 'orders'})
  }

  if (authService.hasPermissions('session', 'read') || authService.isBillingDisabled()) {
    salesSub.items[0].children.push({label: 'Sessions', url: 'sessions'})
  }

  if (authService.hasPermissions('shippingreceipt', 'read') || authService.isBillingDisabled()) {
    salesSub.items[0].children.push({label: 'Shipping Receipts', url: 'shippingreceipts'})
  }

  if (authService.hasPermissions('transaction', 'read') || authService.isBillingDisabled()) {
    salesSub.items[0].children.push({label: 'Transactions', url: 'transactions'})
  }

  mainSection.subsections.push(mainSub);

  if (salesSub.items[0].children.length > 0 && !authService.isActiveOrActingAclMasterAccount()) {
    mainSection.subsections.push(salesSub);
  }

  result.push(mainSection);

  const cycleReports: NavigationMenuItem = { label: 'Reports', icon: 'insert_chart', children: [ ] };

  if ((authService.hasPermissions('analytics', 'getCycleReport') || authService.isBillingDisabled())) {
    cycleReports.children.push({label: 'Cycle Report', url: 'coming-soon'});
  }
  if ((authService.hasPermissions('analytics', 'getDayToDay') || authService.isBillingDisabled())) {
    cycleReports.children.push({label: 'Day-to-Day Report', url: 'coming-soon'});
  }

  if (cycleReports.children.length > 0) {
    cycleReports.children.unshift({ label: 'Cycle Reports', isHeader: true});
  }

  const trafficReport: NavigationMenuItem = { label: 'Reports', icon: 'insert_chart', children: [ ] };

  if ((authService.hasPermissions('analytics', 'getAffiliates') || authService.isBillingDisabled())) {
    trafficReport.children.push({label: 'Affiliates Report', url: 'reports/affiliate'});
  }
  if ((authService.hasPermissions('analytics', 'getMerchants') || authService.isBillingDisabled())) {
    trafficReport.children.push({label: 'Merchants Report', url: 'reports/merchant'});
  }

  if (trafficReport.children.length > 0) {
    trafficReport.children.unshift({ label: 'Traffic Reports', isHeader: true});
  }

  if (trafficReport.children.length > 0 || cycleReports.children.length > 0 || authService.isActiveOrActingAclMasterAccount()) {
    const reportsSection = { subsections: [] };

    if (authService.isActiveOrActingAclMasterAccount()) {
      reportsSection.subsections.push(salesSub)
    }

    const analyticsSubsection = { items: [] };

    if (trafficReport.children.length > 0) {
      analyticsSubsection.items.push(trafficReport)
    }

    reportsSection.subsections.push(analyticsSubsection);

    result.push(reportsSection);
  }

  const crmSection: NavigationMenuSection = {items: []};

  const setup: NavigationMenuItem = { label: 'CRM Setup', icon: 'apps', children: [] };

  if ((authService.hasPermissions('campaign', 'read') || authService.isBillingDisabled())) {
    setup.children.push({label: 'Campaigns', url: 'campaigns'});
  }
  if ((authService.hasPermissions('product', 'read') || authService.isBillingDisabled())) {
    setup.children.push({label: 'Products and Subscriptions', url: 'products'});
  }
  if ((authService.hasPermissions('emailtemplate', 'read') || authService.isBillingDisabled())) {
    setup.children.push({label: 'Email Templates', url: 'emailtemplates'});
  }
  if (setup.children.length > 0) {
    setup.children.unshift({label: 'Product Setup', isHeader: true});

    crmSection.items.push(setup);
  }

  const traffic: NavigationMenuItem = { label: 'Traffic', children: [] };

  if ((authService.hasPermissions('affiliate', 'read') || authService.isBillingDisabled())) {
    traffic.children.push({label: 'Affiliates', url: 'affiliates'});
  }
  if ((authService.hasPermissions('tracker', 'read') || authService.isBillingDisabled())) {
    traffic.children.push({label: 'Tracking', url: 'trackers'});
  }
  if (traffic.children.length > 0) {
    crmSection.items.push(traffic);
  }

  const merchants: NavigationMenuItem = { label: 'Merchants', children: [] };

  if ((authService.hasPermissions('merchantprovider', 'read') || authService.isBillingDisabled())) {
    merchants.children.push({label: 'Merchant Providers', url: 'merchantproviders'});
  }
  if ((authService.hasPermissions('merchantprovidergroup', 'read') || authService.isBillingDisabled())) {
    merchants.children.push({label: 'Merchant Group', url: 'merchantprovidergroups'});
  }
  if (merchants.children.length > 0) {
    crmSection.items.push(merchants);
  }

  const integrations: NavigationMenuItem = { label: '3rd Party Integrations', children: [] };

  if ((authService.hasPermissions('fulfillmentprovider', 'read') || authService.isBillingDisabled())) {
    integrations.children.push({label: 'Fulfillment Providers', url: 'fulfillmentproviders'});
  }
  if ((authService.hasPermissions('smtpprovider', 'read') || authService.isBillingDisabled())) {
    integrations.children.push({label: 'SMTP Providers', url: 'smtpproviders'});
  }
  if (integrations.children.length > 0) {
    crmSection.items.push(integrations);
  }

  if (crmSection.items.length > 0) {
    result.push(crmSection);
  }

  const accountSection: NavigationMenuSection = {items: []};

  const settings: NavigationMenuItem = { label: 'Account', icon: 'work', children: [ ] };

  if ((authService.hasPermissions('account', 'read') || authService.isBillingDisabled())) {
    settings.children.push({label: 'General', url: 'accountmanagement/general'});
  }
  if ((authService.hasPermissions('bill', 'read') || authService.isBillingDisabled())) {
    settings.children.push({label: 'Billing', url: 'accountmanagement/billing'});
  }
  if ((authService.hasPermissions('accesskey', 'read') || authService.isBillingDisabled())) {
    settings.children.push({label: 'API Access Keys', url: 'accountmanagement/apikeys'});
  }
  if ((authService.hasPermissions('role', 'read') || authService.isBillingDisabled())) {
    settings.children.push({label: 'Roles', url: 'accountmanagement/roles'});
  }
  if ((authService.hasPermissions('user', 'read') || authService.isBillingDisabled())) {
    settings.children.push({label: 'Users', url: 'accountmanagement/users'});
  }
  if (settings.children.length > 0) {
    settings.children.unshift({label: 'Account Settings', isHeader: true});

    accountSection.items.push(settings);
  }

  accountSection.items.push({ label: 'My Account', children: [ { label: 'Profile', url: 'profile' }, { label: 'Signing Strings', url: 'profile', fragment: 'signingstrings' } ] });

  result.push(accountSection);

  return result;
}
