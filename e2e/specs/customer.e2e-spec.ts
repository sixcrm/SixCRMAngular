import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {tosCheck, customLogin} from '../utils/action.utils';
import {ReportIndexPage} from '../po/report-index.po';

describe('Customers', function() {
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

  it('should navigate to customers page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(1).click();
    waitForUrlContains('customer');
    expectUrlToContain('customer');
  });

  it('should render customers index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render customers index title', () => {
    expect(page.getTitle().getText()).toContain('Customers')
  });

  it('should render customers index table headers', () => {
    expect(page.getTableHeaders().get(1).getText()).toContain('Status');
    expect(page.getTableHeaders().get(2).getText()).toContain('First Name');
    expect(page.getTableHeaders().get(3).getText()).toContain('Last Name');
    expect(page.getTableHeaders().get(4).getText()).toContain('Email');
    expect(page.getTableHeaders().get(5).getText()).toContain('Phone');
    expect(page.getTableHeaders().get(6).getText()).toContain('Created');
    expect(page.getTableHeaders().get(7).getText()).toContain('Orders');
    expect(page.getTableHeaders().get(8).getText()).toContain('Total Sale amt');
    expect(page.getTableHeaders().get(9).getText()).toContain('Returns');
    expect(page.getTableHeaders().get(10).getText()).toContain('Refunds');
    expect(page.getTableHeaders().get(11).getText()).toContain('Refund Amt');
  });

  it('should render customers quick filters', () => {
    expect(page.getQuickFilters().get(0).getText()).toContain('All');
    expect(page.getQuickFilters().get(1).getText()).toContain('Active');
    expect(page.getQuickFilters().get(2).getText()).toContain('Partial');
  });

  it('should have customers in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have customers in counter', () => {
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

  it('should have customers in table', () => {
    browser.sleep(2000);
    expect(page.getTableRows().count()).toBeGreaterThan(0);
  });

  it('should have customers in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });

  it('should refetch active on quick filter', () => {
    page.getQuickFilters().get(1).click();
    browser.sleep(200);
    expect(page.getTableRows().count()).toEqual(0);
    expect(page.getLoader()).toBeDefined();
  });

  it('should have customers in counter', () => {
    expect(page.getQuickFilterCounter(0).getText()).toBeGreaterThan(0);
  });


});
