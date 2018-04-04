import {waitForUrlContains, navigateSuperuserToHomepage} from '../utils/navigation.utils';
import {SidenavPage} from '../po/sidenav.po';
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

  it('should navigate to affiliate report page', () => {
    const sidenav = new SidenavPage();
    sidenav.getItems().get(10).click();
    browser.sleep(500);
    sidenav.getLink(15).click();
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
