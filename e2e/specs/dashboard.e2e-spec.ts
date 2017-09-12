import {DashboardPage} from '../po/dashboard.po';
import {browser, by} from 'protractor';
import {login} from '../utils/action.utils';
import {
  expectUrlToContain, expectNotPresent, expectDefined, expectPresent,
} from '../utils/assertation.utils';
import {AppPage} from '../po/app.po';
import {waitForNotPresenceOf, waitForUrlContains} from '../utils/navigation.utils';
import {SidenavPage} from '../po/sidenav.po';

describe('Dashboard', function() {
  let dashboard: DashboardPage;
  let app: AppPage;

  beforeEach(() => {
    dashboard = new DashboardPage();
    app = new AppPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);
  });

  it('should navigate to dashboard after login', () => {
    login();

    expectUrlToContain('dashboard');
  });

  it('should display advanced filter component', () => {
    expect(dashboard.getAdvancedFilterComponent()).toBeDefined();
  });

  it('should display all chart component', () => {
    expectDefined(dashboard.getDashboardReports());
    expectDefined(dashboard.getEventsBy());
    expectDefined(dashboard.getEventsSummary());
    expectDefined(dashboard.getTransactionOverview());
    expectDefined(dashboard.getTransactionBy());
    expectDefined(dashboard.getTransactionSummary());
    expectDefined(dashboard.getFunnelGraph());
    expectDefined(dashboard.getMoversCard());
    expectDefined(dashboard.getTopCampaigns());
  });

  it('should load visible chart component in less than 6 seconds', () => {
    browser.sleep(6000);
    expectNotPresent(dashboard.getTransactionOverviewLoader());
  });

  it('should reload when advanced filter reload is clicked in less than 2 seconds', () => {
    dashboard.getAdvancedFilterReload().click();

    browser.sleep(50);
    expectPresent(dashboard.getTransactionOverviewLoader());

    browser.sleep(2000);
    expectNotPresent(dashboard.getTransactionOverviewLoader());
  });

  it('should reload when advanced filter date is changed in less than 6 seconds', () => {
    dashboard.getAdvancedFilterDates().get(0).click();

    browser.sleep(50);
    expectPresent(app.getProgressBar());

    browser.sleep(6000);
    expectNotPresent(app.getProgressBar());
  });

  it('should reset is clicked in less than 6 seconds', () => {
    dashboard.getResetButton().click();

    browser.sleep(50);
    expectPresent(app.getProgressBar());

    browser.sleep(6000);
    expectNotPresent(app.getProgressBar());
  });

  it('should cache dashboard results', () => {
    const sidenav = new SidenavPage();

    sidenav.getLink(8).click();
    waitForUrlContains('customers');
    waitForNotPresenceOf(app.getProgressBar());

    sidenav.getLink(0).click();
    waitForUrlContains('dashboard');

    browser.sleep(50);
    expectNotPresent(app.getProgressBar());
    expectNotPresent(dashboard.getTransactionOverviewLoader());
  })
});

function getLoader(component) {
  return component.element(by.css('md-spinner'))
}
