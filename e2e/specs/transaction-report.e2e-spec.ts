import {waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectNotPresent, expectPresent} from '../utils/assertation.utils';
import {ReportPage} from '../po/report.po';

describe('Transaction Report', function() {
  let transactionReport: ReportPage;

  beforeEach(() => {
    transactionReport = new ReportPage();
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

  it('should navigate to transactions report page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(1).click();
    waitForUrlContains('reports/transaction');
    expectUrlToContain('reports/transaction');
  });

  it('should render loaders', () => {
    expectPresent(transactionReport.getReportTableLoader());
    expectPresent(transactionReport.getSummaryTableLoader());
  });

  it('should render to transactions report page title', () => {
    expect(transactionReport.getTitle().getText()).toEqual('Transactions Report');
  });

  it('should hide loaders after 3 seconds', () => {
    browser.sleep(3000);

    expectNotPresent(transactionReport.getReportTableLoader());
    expectNotPresent(transactionReport.getSummaryTableLoader());
  });

});
