import {DashboardPage} from '../po/dashboard.po';
import {browser, by} from 'protractor';
import {login} from '../utils/action.utils';
import {
  expectUrlToContain, expectNotPresent, expectDefined, expectPresent,
} from '../utils/assertation.utils';
import {AppPage} from '../po/app.po';
import {waitForNotPresenceOf, waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
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
    browser.get('/');
    clearLocalStorage();
    login();
  });

  it('should navigate to dashboard after login', () => {
    expectUrlToContain('dashboard');
  });
  /*
  it('should display advanced filter component', () => {
    expect(dashboard.getAdvancedFilterComponent()).toBeDefined();
  });
  */
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

  it('should cache dashboard results', () => {
    const sidenav = new SidenavPage();

    sidenav.getItems().get(2).click();
    browser.sleep(500);
    sidenav.getLink(3).click();

    waitForUrlContains('customers');
    waitForNotPresenceOf(app.getProgressBar());

    sidenav.getLink(0).click();
    waitForUrlContains('dashboard');

    browser.sleep(50);
    expectNotPresent(app.getProgressBar());
    expectNotPresent(dashboard.getTransactionOverviewLoader());
  });
});
