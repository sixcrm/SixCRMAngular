import {waitForUrlContains, navigateSuperuserToHomepage} from '../utils/navigation.utils';
import {SidenavPage} from '../po/sidenav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectNotPresent, expectPresent} from '../utils/assertation.utils';
import {ReportPage} from '../po/report.po';

describe('Merchant Report', function() {
  let merchantReport: ReportPage;

  beforeEach(() => {
    merchantReport = new ReportPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);
    browser.get('/');
    browser.waitForAngularEnabled(false);
    navigateSuperuserToHomepage();
    waitForUrlContains('dashboard');
  });

  it('should navigate to merchants report page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(2).click();
    browser.sleep(500);
    sidenav.getLink(6).click();
    waitForUrlContains('reports/merchant');
    expectUrlToContain('reports/merchant');
  });

  it('should render loaders', () => {
    expectPresent(merchantReport.getReportTableLoader());
  });

  it('should render to merchant report page title', () => {
    expect(merchantReport.getTitle().getText()).toEqual('Merchant Report');
  });

  it('should hide loaders after 3 seconds', () => {
    browser.sleep(3000);

    expectNotPresent(merchantReport.getReportTableLoader());
  });

});
