import {clearLocalStorage, waitForUrlContains, clearAuth0SSO} from '../utils/navigation.utils';
import {expectUrlToContain} from '../utils/assertation.utils';
import {browser} from 'protractor';
import {login, tosCheck} from '../utils/action.utils';
import {NavPage} from '../po/nav.po';

describe('Navigation', function() {

  let nav: NavPage;

  beforeEach(() => {
    nav = new NavPage();
    browser.sleep(100);
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 1440);

    browser.get('/');
    clearLocalStorage();
    login();
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should render full sidenav when registered as master', () => {
    browser.sleep(500);
    waitForUrlContains('/dashboard');

    browser.sleep(2000);

    nav.getNavToggler().click();
    expect(nav.getItems().count()).toBe(25);
  });

  it('should navigate to dashboard', () => {
    nav.getLink(0).click();

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  });

  // Orders
  it('should navigate to customers', () => {
    nav.getNavToggler().click();
    nav.getLink(1).click();

    waitForUrlContains('customers');
    expectUrlToContain('customers');
  });

  it('should navigate to orders', () => {
    nav.getNavToggler().click();
    nav.getLink(2).click();

    waitForUrlContains('orders');
    expectUrlToContain('orders');
  });

  it('should navigate to sessions', () => {
    nav.getNavToggler().click();
    nav.getLink(3).click();

    waitForUrlContains('sessions');
    expectUrlToContain('sessions');
  });

  it('should navigate to shippingreceipts', () => {
    nav.getNavToggler().click();
    nav.getLink(4).click();

    waitForUrlContains('shippingreceipts');
    expectUrlToContain('shippingreceipts');
  });

  it('should navigate to transactions', () => {
    nav.getNavToggler().click();
    nav.getLink(5).click();

    waitForUrlContains('transactions');
    expectUrlToContain('transactions');
  });

  // Reports
  it('should navigate to affiliate report', () => {
    nav.getNavToggler().click();
    nav.getLink(6).click();

    waitForUrlContains('affiliate');
    expectUrlToContain('affiliate');
  });

  it('should navigate to merchants report', () => {
    nav.getNavToggler().click();
    nav.getLink(7).click();

    waitForUrlContains('merchant');
    expectUrlToContain('merchant');
  });

  // CRM Setup Section
  it('should navigate to campaigns', () => {
    nav.getNavToggler().click();
    nav.getLink(8).click();

    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should navigate to products', () => {
    nav.getNavToggler().click();
    nav.getLink(9).click();

    waitForUrlContains('products');
    expectUrlToContain('products');
  });

  it('should navigate to product schedules', () => {
    nav.getNavToggler().click();
    nav.getLink(10).click();

    waitForUrlContains('productschedules');
    expectUrlToContain('productschedules');
  });

  it('should navigate to email templates', () => {
    nav.getNavToggler().click();
    nav.getLink(11).click();

    waitForUrlContains('emailtemplates');
    expectUrlToContain('emailtemplates');
  });

  it('should navigate to affiliates', () => {
    nav.getNavToggler().click();
    nav.getLink(12).click();

    waitForUrlContains('affiliates');
    expectUrlToContain('affiliates');
  });

  it('should navigate to trackers', () => {
    nav.getNavToggler().click();
    nav.getLink(13).click();

    waitForUrlContains('trackers');
    expectUrlToContain('trackers');
  });

  it('should navigate to merchant providers', () => {
    nav.getNavToggler().click();
    nav.getLink(14).click();

    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');
  });

  it('should navigate to merchant groups', () => {
    nav.getNavToggler().click();
    nav.getLink(15).click();

    waitForUrlContains('merchantprovidergroups');
    expectUrlToContain('merchantprovidergroups');
  });

  it('should navigate to fulfillment providers', () => {
    nav.getNavToggler().click();
    nav.getLink(16).click();

    waitForUrlContains('fulfillmentproviders');
    expectUrlToContain('fulfillmentproviders');
  });

  it('should navigate to smtp providers', () => {
    nav.getNavToggler().click();
    nav.getLink(17).click();

    waitForUrlContains('smtpproviders');
    expectUrlToContain('smtpproviders');
  });

  it('should navigate to account general', () => {
    nav.getNavToggler().click();
    nav.getLink(18).click();

    waitForUrlContains('accountmanagement/general');
    expectUrlToContain('accountmanagement/general');
  });

  it('should navigate to account billing', () => {
    nav.getNavToggler().click();
    nav.getLink(19).click();

    waitForUrlContains('accountmanagement/billing');
    expectUrlToContain('accountmanagement/billing');
  });

  it('should navigate to account keys', () => {
    nav.getNavToggler().click();
    nav.getLink(20).click();

    waitForUrlContains('accountmanagement/apikeys');
    expectUrlToContain('accountmanagement/apikeys');
  });

  it('should navigate to account roles', () => {
    nav.getNavToggler().click();
    nav.getLink(21).click();

    waitForUrlContains('accountmanagement/roles');
    expectUrlToContain('accountmanagement/roles');
  });

  it('should navigate to account users', () => {
    nav.getNavToggler().click();
    nav.getLink(22).click();

    waitForUrlContains('accountmanagement/users');
    expectUrlToContain('accountmanagement/users');
  });

  it('should navigate to profile', () => {
    nav.getNavToggler().click();
    nav.getLink(23).click();

    waitForUrlContains('profile');
    expectUrlToContain('profile');
  });

  it('should navigate to signing strings', () => {
    nav.getNavToggler().click();
    nav.getLink(24).click();

    waitForUrlContains('profile#signingstrings');
    expectUrlToContain('profile#signingstrings');
  });

});
