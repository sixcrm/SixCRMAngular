import {waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage} from '../utils/navigation.utils';
import {NavPage} from '../po/sidenav.po';
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

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to merchant report page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(7).click();
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
