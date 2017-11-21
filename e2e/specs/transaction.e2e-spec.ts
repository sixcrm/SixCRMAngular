import {waitForUrlContains, navigateSuperuserToHomepage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectNotPresent} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';

describe('Transactions', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;
  let selectedAlias: any;

  beforeEach(() => {
    page = new EntityIndexPage();
    view = new EntityViewPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.waitForAngularEnabled(false);

    navigateSuperuserToHomepage();
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    browser.waitForAngularEnabled(false);
  });

  it('should navigate to transactions page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(20).click();
    waitForUrlContains('transaction');
    expectUrlToContain('transaction');
  });

  it('should render transactions index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render transactions index title', () => {
    expect(page.getTitle().getText()).toContain('Transactions')
  });

  it('should not render transactions index add button', () => {
    expectNotPresent(page.getAddButton());
  });

  it('should render transactions index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Alias');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Amount');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Created At');
    expect(page.getTableHeaders().get(3).getText()).toEqual('Processor Response');
  });

  it('should open transaction when clicked clicked', () => {
    browser.sleep(1000);
    selectedAlias = page.getCell(0,0).getText();

    page.getCell(0,0).click();

    waitForUrlContains('transactions/');
    expectUrlToContain('transactions/');
  });


  it('should render correct transaction alias', () => {
    browser.sleep(1000);

    expect(view.getEntityNameHeaderSolo().getText()).toEqual(selectedAlias)
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(2);
  })
});
