import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {tosCheck, customLogin} from '../utils/action.utils';
import {ReportIndexPage} from '../po/report-index.po';

describe('Transactions', function() {
  let page: ReportIndexPage;

  beforeEach(() => {
    page = new ReportIndexPage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    customLogin('e2e-create-order@sixcrm.com', '123456789');
    waitForUrlContains('dashboard');
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should navigate to transactions page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(5).click();
    waitForUrlContains('transaction');
    expectUrlToContain('transaction');
  });

  it('should render transactions index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render transactions index title', () => {
    expect(page.getTitle().getText()).toContain('Transactions')
  });

  it('should render transactions index table headers', () => {
    expect(page.getTableHeaders().get(1).getText()).toContain('Date');
    expect(page.getTableHeaders().get(2).getText()).toContain('Response');
    expect(page.getTableHeaders().get(3).getText()).toContain('Type');
    expect(page.getTableHeaders().get(4).getText()).toContain('Customer');
    expect(page.getTableHeaders().get(5).getText()).toContain('Order Alias');
    expect(page.getTableHeaders().get(6).getText()).toContain('Transaction Alias');
    expect(page.getTableHeaders().get(7).getText()).toContain('MID');
    expect(page.getTableHeaders().get(8).getText()).toContain('Amount');
    expect(page.getTableHeaders().get(9).getText()).toContain('Refund');
    expect(page.getTableHeaders().get(10).getText()).toContain('Processor Message');
  });

  it('should render transactions quick filters', () => {
    expect(page.getQuickFilters().get(0).getText()).toContain('All');
    expect(page.getQuickFilters().get(1).getText()).toContain('Refunds');
    expect(page.getQuickFilters().get(2).getText()).toContain('Errors');
    expect(page.getQuickFilters().get(3).getText()).toContain('Declines');
  });

  it('should have transactions in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have transactions in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });

  it('should render filters component', () => {
    page.getOpenFilterButton().click();
    expect(page.getFiltersDialog()).toBeDefined()
  });

  it('should refetch on filter', () => {
    browser.sleep(2000);
    page.getFilterButton().click();
    browser.sleep(500);
    expect(page.getTableRows().count()).toEqual(0);
    expect(page.getLoader()).toBeDefined();
  });

  it('should have transactions in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have transactions in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });

  it('should open customer and navigate back to transactions', () => {
    browser.sleep(1000);
    page.getLink(0,4).click();
    waitForUrlContains('/customers/advanced?customer=');
    expectUrlToContain('/customers/advanced?customer=');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/transactions');
    expectUrlToContain('/transactions');
  });

  it('should open orders and navigate back to transactions', () => {
    browser.sleep(1000);
    page.getLink(0,5).click();
    waitForUrlContains('/customers/advanced?order=');
    expectUrlToContain('/customers/advanced?order=');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/transactions');
    expectUrlToContain('/transactions');
  });

  it('should open transaction and navigate back to transactions', () => {
    browser.sleep(1000);
    page.getLink(0,6).click();
    waitForUrlContains('/customers/advanced?transaction=');
    expectUrlToContain('/customers/advanced?transaction=');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/transactions');
    expectUrlToContain('/transactions');
  });

  it('should open MID and navigate back to transactions', () => {
    browser.sleep(1000);
    page.getLink(0,7).click();
    waitForUrlContains('/merchantproviders');
    expectUrlToContain('/merchantproviders');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/transactions');
    expectUrlToContain('/transactions');
  });

  it('should refetch chargebacks on quick filter', () => {
    page.getQuickFilters().get(1).click();
    browser.sleep(200);
    expect(page.getTableRows().count()).toEqual(0);
    expect(page.getLoader()).toBeDefined();
  });

  it('should not have transactions in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toEqual(0);
  });

  it('should have transactions in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });


});
