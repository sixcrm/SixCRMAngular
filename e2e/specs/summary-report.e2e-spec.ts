import {waitForUrlContains, navigateSuperuserToHomepage} from '../utils/navigation.utils';
import {SidenavPage} from '../po/sidenav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectNotPresent, expectPresent} from '../utils/assertation.utils';
import {SummaryReportPage} from '../po/summary-report.po';

fdescribe('Summary Report', function() {
  let summaryReport: SummaryReportPage;

  beforeEach(() => {
    summaryReport = new SummaryReportPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);
    browser.get('/');
    browser.waitForAngularEnabled(false);
    navigateSuperuserToHomepage();
    waitForUrlContains('dashboard');
  });

  it('should navigate to summary report page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(2).click();
    browser.sleep(500);
    sidenav.getLink(4).click();
    waitForUrlContains('reports/summary');
    expectUrlToContain('reports/summary');
  });

  it('should render to summary report page title', () => {
    expect(summaryReport.getTitle().getText()).toEqual('Summary Report');
  });

  it('should render loaders', () => {
    expectPresent(summaryReport.getReportTableLoader());
    expectPresent(summaryReport.getSummaryTableLoader());
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
