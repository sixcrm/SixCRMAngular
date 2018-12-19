import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {tosCheck, customLogin} from '../utils/action.utils';
import {ReportIndexPage} from '../po/report-index.po';

describe('Subscription', function() {
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

  it('should navigate to subscriptions page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(2).click();
    waitForUrlContains('subscriptions');
    expectUrlToContain('subscriptions');
  });

  it('should render subscriptions index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render subscriptions index title', () => {
    expect(page.getTitle().getText()).toContain('Subscriptions')
  });

  it('should render subscriptions index table headers', () => {
    expect(page.getTableHeaders().get(1).getText()).toContain('Date');
    expect(page.getTableHeaders().get(2).getText()).toContain('Alias');
    expect(page.getTableHeaders().get(3).getText()).toContain('Status');
    expect(page.getTableHeaders().get(4).getText()).toContain('Cycle');
    expect(page.getTableHeaders().get(5).getText()).toContain('Interval');
    expect(page.getTableHeaders().get(6).getText()).toContain('Sale Amount');
    expect(page.getTableHeaders().get(7).getText()).toContain('Items');
    expect(page.getTableHeaders().get(8).getText()).toContain('Customer');
    expect(page.getTableHeaders().get(9).getText()).toContain('Campaign');
  });

  it('should render subscriptions quick filters', () => {
    expect(page.getQuickFilters().get(0).getText()).toContain('All');
    expect(page.getQuickFilters().get(1).getText()).toContain('Active');
    expect(page.getQuickFilters().get(2).getText()).toContain('Cancelled');
  });

  it('should have subscriptions in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have subscriptions in counter', () => {
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

  it('should have subscriptions in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have subscriptions in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });

  it('should refetch active on quick filter', () => {
    page.getQuickFilters().get(1).click();
    browser.sleep(200);
    expect(page.getTableRows().count()).toEqual(0);
    expect(page.getLoader()).toBeDefined();
  });

  it('should not have subscriptions in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toEqual(0);
  });

  it('should have subscriptions in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });


});
