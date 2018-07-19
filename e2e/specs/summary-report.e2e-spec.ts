import {waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectNotPresent, expectPresent} from '../utils/assertation.utils';
import {ReportPage} from '../po/report.po';

describe('Summary Report', function() {
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

  it('should navigate to summary report page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(1).click();
    waitForUrlContains('reports/summary');
    expectUrlToContain('reports/summary');
  });

  it('should render loaders', () => {
    expectPresent(summaryReport.getReportTableLoader());
    expectPresent(summaryReport.getSummaryTableLoader());
  });

  it('should render to summary report page title', () => {
    expect(summaryReport.getTitle().getText()).toEqual('Summary Report');
  });

  it('should hide loaders after 3 seconds', () => {
    browser.sleep(3000);

    expectNotPresent(summaryReport.getReportTableLoader());
    expectNotPresent(summaryReport.getSummaryTableLoader());
  });

  it('should open details page', () => {
    browser.sleep(3000);

    summaryReport.getReportTableFirstItem().click();

    waitForUrlContains('reports/transaction');
    expectUrlToContain('reports/transaction');
  });

});
