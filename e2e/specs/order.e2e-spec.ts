import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {tosCheck, customLogin} from '../utils/action.utils';
import {ReportIndexPage} from '../po/report-index.po';

describe('Orders', function() {
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

  it('should navigate to orders page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(2).click();
    waitForUrlContains('orders');
    expectUrlToContain('orders');
  });

  it('should render orders index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render orders index title', () => {
    expect(page.getTitle().getText()).toContain('Orders')
  });

  it('should render orders index table headers', () => {
    expect(page.getTableHeaders().get(1).getText()).toContain('Date');
    expect(page.getTableHeaders().get(2).getText()).toContain('Status');
    expect(page.getTableHeaders().get(3).getText()).toContain('Type');
    expect(page.getTableHeaders().get(4).getText()).toContain('Sale Amount');
    expect(page.getTableHeaders().get(5).getText()).toContain('Items');
    expect(page.getTableHeaders().get(6).getText()).toContain('Returns');
    expect(page.getTableHeaders().get(7).getText()).toContain('Refunds');
    expect(page.getTableHeaders().get(8).getText()).toContain('Total');
    expect(page.getTableHeaders().get(9).getText()).toContain('Order Alias');
    expect(page.getTableHeaders().get(10).getText()).toContain('Order Campaign');
    expect(page.getTableHeaders().get(11).getText()).toContain('Customer');
  });

  it('should render orders quick filters', () => {
    expect(page.getQuickFilters().get(0).getText()).toContain('All');
    expect(page.getQuickFilters().get(1).getText()).toContain('Shipped');
    expect(page.getQuickFilters().get(2).getText()).toContain('Closed');
    expect(page.getQuickFilters().get(3).getText()).toContain('Error');
  });

  it('should have orders in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have orders in counter', () => {
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

  it('should have orders in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have orders in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });

  it('should open order and navigate back to orders', () => {
    page.getLink(0,9).click();
    waitForUrlContains('/customers/advanced?order=');
    expectUrlToContain('/customers/advanced?order=');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/orders');
    expectUrlToContain('/orders');
  });

  it('should open campaign and navigate back to orders', () => {
    browser.sleep(1000);
    page.getLink(0,10).click();
    waitForUrlContains('/campaigns/');
    expectUrlToContain('/campaigns/');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/orders');
    expectUrlToContain('/orders');
  });

  it('should open customer and navigate back to orders', () => {
    browser.sleep(1000);
    page.getLink(0,11).click();
    waitForUrlContains('/customers/advanced?customer=');
    expectUrlToContain('/customers/advanced?customer=');

    browser.sleep(1000);
    page.getBackButton().click();
    waitForUrlContains('/orders');
    expectUrlToContain('/orders');
  });

  it('should fetch 0 orders on random amount filter', () => {
    page.getOpenFilterButton().click();
    browser.sleep(200);
    page.getFirstValueInputOfFilterValuesSection(1).sendKeys('12345');
    page.getFilterButton().click();
    browser.sleep(2000);
    expect(page.getTableRows().count()).toEqual(0);
  });

  it('should have orders in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });

  it('should refetch all orders on all quick filter', () => {
    page.getQuickFilters().get(0).click();
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

});
