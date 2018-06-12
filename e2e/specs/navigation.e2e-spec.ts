import { clearLocalStorage, waitForUrlContains } from '../utils/navigation.utils';
import {expectUrlToContain} from '../utils/assertation.utils';
import {browser} from 'protractor';
import {login, tosCheck} from '../utils/action.utils';
import {SidenavPage} from '../po/sidenav.po';

describe('Navigation', function() {

  let sidenav: SidenavPage;

  beforeEach(() => {
    sidenav = new SidenavPage();
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
  });

  it('should render full sidenav when registered as master', () => {
    sidenav.get();
    browser.sleep(500);
    waitForUrlContains('/dashboard');

    browser.sleep(500);
    expect(sidenav.getItems().count()).toBe(32);
  });

  it('should navigate to dashboard', () => {
    sidenav.getItems().get(0).click();

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  });

  // Orders
  it('should navigate to customers', () => {
    sidenav.getItems().get(1).click();
    browser.sleep(500);
    sidenav.getLink(2).click();

    waitForUrlContains('customers');
    expectUrlToContain('customers');
  });

  it('should navigate to credit cards', () => {
    sidenav.getItems().get(1).click();
    browser.sleep(500);
    sidenav.getLink(3).click();

    waitForUrlContains('creditcards');
    expectUrlToContain('creditcards');
  });

  it('should navigate to sessions', () => {
    sidenav.getLink(4).click();

    waitForUrlContains('sessions');
    expectUrlToContain('sessions');
  });

  it('should navigate to transactions', () => {
    sidenav.getLink(5).click();

    waitForUrlContains('transactions');
    expectUrlToContain('transactions');
  });

  it('should navigate to rebills', () => {
    sidenav.getLink(6).click();

    waitForUrlContains('rebills');
    expectUrlToContain('rebills');
  });

  it('should navigate to shippingreceipts', () => {
    sidenav.getLink(7).click();

    waitForUrlContains('shippingreceipts');
    expectUrlToContain('shippingreceipts');
  });

  // Reports
  it('should navigate to affiliate report', () => {
    sidenav.getItems().get(8).click();
    browser.sleep(500);
    sidenav.getLink(10).click();

    waitForUrlContains('affiliate');
    expectUrlToContain('affiliate');
  });

  it('should navigate to merchants report', () => {
    sidenav.getLink(11).click();

    waitForUrlContains('merchant');
    expectUrlToContain('merchant');
  });

  // CRM Setup Section
  it('should navigate to campaigns', () => {
    sidenav.getItems().get(12).click();
    browser.sleep(1500);
    sidenav.getLink(13).click();
    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should navigate to products', () => {
    sidenav.getLink(14).click();
    waitForUrlContains('products');
    expectUrlToContain('products');
  });

  it('should navigate to product schedules', () => {
    sidenav.getLink(15).click();

    waitForUrlContains('productschedules');
    expectUrlToContain('productschedules');
  });

  it('should navigate to email templates', () => {
    sidenav.getLink(16).click();

    waitForUrlContains('emailtemplates');
    expectUrlToContain('emailtemplates');
  });

  it('should navigate to affiliates', () => {
    sidenav.getLink(18).click();

    waitForUrlContains('affiliates');
    expectUrlToContain('affiliates');
  });

  it('should navigate to trackers', () => {
    sidenav.getLink(19).click();

    waitForUrlContains('trackers');
    expectUrlToContain('trackers');
  });

  it('should navigate to merchant providers', () => {
    sidenav.getLink(21).click();

    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');
  });

  it('should navigate to merchantProviderGroups', () => {
    sidenav.getLink(22).click();

    waitForUrlContains('merchantprovidergroups');
    expectUrlToContain('merchantprovidergroups');
  });

  it('should navigate to fulfillment providers', () => {
    sidenav.getLink(24).click();

    waitForUrlContains('fulfillmentproviders');
    expectUrlToContain('fulfillmentproviders');
  });

  it('should navigate to smtp providers', () => {
    sidenav.getLink(25).click();

    waitForUrlContains('smtpproviders');
    expectUrlToContain('smtpproviders');
  });

});
