import { clearLocalStorage, waitForUrlContains } from '../utils/navigation.utils';
import {expectUrlToContain} from '../utils/assertation.utils';
import {browser} from 'protractor';
import {login} from '../utils/action.utils';
import {SidenavPage} from '../po/sidenav.po';

describe('Navigation', function() {

  let sidenav: SidenavPage;

  beforeEach(() => {
    sidenav = new SidenavPage();
    browser.sleep(100);
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 1440);

    browser.get('/');
    clearLocalStorage();
    login();
  });

  afterAll(() => {
    clearLocalStorage();
  });

  it('should render full sidenav when registered as master', () => {
    sidenav.get();
    waitForUrlContains('/dashboard');

    browser.sleep(500);
    expect(sidenav.getItems().count()).toBe(36);
  });

  it('should navigate to dashboard', () => {
    sidenav.getItems().get(0).click();

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  });

  it('should navigate to state machine', () => {
    sidenav.getItems().get(1).click();

    waitForUrlContains('state-machine');
    expectUrlToContain('state-machine');
  });

  it('should navigate to customers', () => {
    sidenav.getLink(11).click();

    waitForUrlContains('customers');
    expectUrlToContain('customers');
  });

  it('should navigate to products', () => {
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(13).click();

    waitForUrlContains('products');
    expectUrlToContain('products');
  });

  it('should navigate to product schedules', () => {
    sidenav.getLink(14).click();

    waitForUrlContains('productschedules');
    expectUrlToContain('productschedules');
  });

  it('should navigate to campaigns', () => {
    sidenav.getLink(15).click();

    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should navigate to email templates', () => {
    sidenav.getLink(16).click();

    waitForUrlContains('emailtemplates');
    expectUrlToContain('emailtemplates');
  });

  it('should navigate to affiliates', () => {
    sidenav.getLink(17).click();

    waitForUrlContains('affiliates');
    expectUrlToContain('affiliates');
  });

  it('should navigate to trackers', () => {
    sidenav.getLink(18).click();

    waitForUrlContains('trackers');
    expectUrlToContain('trackers');
  });

  it('should navigate to sessions', () => {
    sidenav.getLink(19).click();

    waitForUrlContains('sessions');
    expectUrlToContain('sessions');
  });

  it('should navigate to transactions', () => {
    sidenav.getLink(20).click();

    waitForUrlContains('transactions');
    expectUrlToContain('transactions');
  });

  it('should navigate to rebills', () => {
    sidenav.getLink(21).click();

    waitForUrlContains('rebills');
    expectUrlToContain('rebills');
  });

  it('should navigate to shippingreceipts', () => {
    sidenav.getLink(22).click();

    waitForUrlContains('shippingreceipts');
    expectUrlToContain('shippingreceipts');
  });

  it('should navigate to fulfillment providers', () => {
    sidenav.getLink(23).click();
    browser.sleep(500);
    sidenav.getLink(24).click();

    waitForUrlContains('fulfillmentproviders');
    expectUrlToContain('fulfillmentproviders');
  });

  it('should navigate to smtp providers', () => {
    sidenav.getLink(25).click();

    waitForUrlContains('smtpproviders');
    expectUrlToContain('smtpproviders');
  });

  it('should navigate to merchant providers', () => {
    sidenav.getLink(26).click();
    browser.sleep(500);
    sidenav.getLink(27).click();

    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');
  });

  it('should navigate to merchantProviderGroups', () => {
    sidenav.getLink(28).click();

    waitForUrlContains('merchantProviderGroups');
    expectUrlToContain('merchantProviderGroups');
  });

  it('should navigate to accounts', () => {
    sidenav.getLink(29).click();
    browser.sleep(500);
    sidenav.getLink(30).click();

    waitForUrlContains('accounts');
    expectUrlToContain('accounts');
  });

  it('should navigate to roles', () => {
    sidenav.getLink(31).click();

    waitForUrlContains('roles');
    expectUrlToContain('roles');
  });

  it('should navigate to graph docs', () => {
    sidenav.getLink(35).click();
    browser.sleep(500);
    sidenav.getLink(36).click();

    waitForUrlContains('documentation/graph');
    expectUrlToContain('documentation/graph');
  });

  it('should navigate to search', () => {
    sidenav.getLink(38).click();

    waitForUrlContains('search');
    expectUrlToContain('search');
  });
});
