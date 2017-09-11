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

    login();
  });

  afterAll(() => {
    clearLocalStorage();
  });

  it('should render full sidenav when registered as master', () => {
    sidenav.get();
    waitForUrlContains('/dashboard');

    browser.sleep(100);
    expect(sidenav.getItems().count()).toBe(34);
  });

  it('should navigate to dashboard', () => {
    sidenav.getItems().get(0).click();

    browser.sleep(100);
    expectUrlToContain('dashboard');
  });

  it('should navigate to customers', () => {
    sidenav.getLink(8).click();

    browser.sleep(100);
    expectUrlToContain('customers');
  });

  it('should navigate to products', () => {
    sidenav.getLink(9).click();
    browser.sleep(500);
    sidenav.getLink(10).click();

    browser.sleep(100);
    expectUrlToContain('products');
  });

  it('should navigate to product schedules', () => {
    sidenav.getLink(11).click();

    browser.sleep(100);
    expectUrlToContain('productschedules');
  });

  it('should navigate to campaigns', () => {
    sidenav.getLink(12).click();

    browser.sleep(100);
    expectUrlToContain('campaigns');
  });

  it('should navigate to email templates', () => {
    sidenav.getLink(13).click();

    browser.sleep(100);
    expectUrlToContain('emailtemplates');
  });

  it('should navigate to affiliates', () => {
    sidenav.getLink(14).click();

    browser.sleep(100);
    expectUrlToContain('affiliates');
  });

  it('should navigate to trackers', () => {
    sidenav.getLink(15).click();

    browser.sleep(100);
    expectUrlToContain('trackers');
  });

  it('should navigate to sessions', () => {
    sidenav.getLink(16).click();

    browser.sleep(100);
    expectUrlToContain('sessions');
  });

  it('should navigate to transactions', () => {
    sidenav.getLink(17).click();

    browser.sleep(100);
    expectUrlToContain('transactions');
  });

  it('should navigate to rebills', () => {
    sidenav.getLink(18).click();

    browser.sleep(100);
    expectUrlToContain('rebills');
  });

  it('should navigate to fulfillment providers', () => {
    sidenav.getLink(19).click();
    browser.sleep(500);
    sidenav.getLink(20).click();

    browser.sleep(100);
    expectUrlToContain('fulfillmentproviders');
  });

  it('should navigate to smtp providers', () => {
    sidenav.getLink(21).click();

    browser.sleep(100);
    expectUrlToContain('smtpproviders');
  });

  it('should navigate to merchant providers', () => {
    sidenav.getLink(22).click();
    browser.sleep(500);
    sidenav.getLink(23).click();

    browser.sleep(100);
    expectUrlToContain('merchantproviders');
  });

  it('should navigate to loadbalancers', () => {
    sidenav.getLink(24).click();

    browser.sleep(100);
    expectUrlToContain('loadbalancers');
  });

  it('should navigate to users', () => {
    sidenav.getLink(25).click();
    browser.sleep(500);
    sidenav.getLink(26).click();

    browser.sleep(100);
    expectUrlToContain('users');
  });

  it('should navigate to accounts', () => {
    sidenav.getLink(27).click();

    browser.sleep(100);
    expectUrlToContain('accounts');
  });

  it('should navigate to billing', () => {
    sidenav.getLink(28).click();

    browser.sleep(100);
    expectUrlToContain('billing');
  });

  it('should navigate to roles', () => {
    sidenav.getLink(29).click();

    browser.sleep(100);
    expectUrlToContain('roles');
  });

  it('should navigate to graph docs', () => {
    sidenav.getLink(30).click();
    browser.sleep(500);
    sidenav.getLink(31).click();

    browser.sleep(100);
    expectUrlToContain('documentation/graph');
  });

  it('should navigate to search', () => {
    sidenav.getLink(33).click();

    browser.sleep(100);
    expectUrlToContain('search');
  });
});
