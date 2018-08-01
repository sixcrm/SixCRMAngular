import {waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectNotPresent, expectPresent} from '../utils/assertation.utils';
import {ReportPage} from '../po/report.po';

describe('Affiliate Report', function() {
  let summaryReport: ReportPage;

  beforeEach(() => {
    summaryReport = new ReportPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);
    browser.get('/');
    browser.waitForAngularEnabled(false);
    navigateSuperuserToHomepage();
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to affiliate report page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(6).click();
    waitForUrlContains('reports/affiliate');
    expectUrlToContain('reports/affiliate');
  });

  it('should render loaders', () => {
    expectPresent(summaryReport.getReportTableLoader());
    expectPresent(summaryReport.getSummaryTableLoader());
  });

  it('should render to affiliate report page title', () => {
    expect(summaryReport.getTitle().getText()).toEqual('Affiliate Report');
  });

  it('should hide loaders after 3 seconds', () => {
    browser.sleep(3000);

    expectNotPresent(summaryReport.getReportTableLoader());
    expectNotPresent(summaryReport.getSummaryTableLoader());
  });

});
