import {
  waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage,
  clearAuth0SSO
} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectNotPresent, expectPresent} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';

describe('Session', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;

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
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should navigate to sessions page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(2).click();
    waitForUrlContains('sessions');
    expectUrlToContain('session');
  });

  it('should render sessions index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render sessions index title', () => {
    expect(page.getTitle().getText()).toContain('Sessions')
  });

  it('should not render sessions index add button', () => {
    expectNotPresent(page.getAddButton());
  });

  it('should render sessions index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Customer Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Campaign Name');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Number of Product Schedules');
    expect(page.getTableHeaders().get(3).getText()).toEqual('Number of Rebills');
  });

  it('should open session when clicked clicked', () => {
    browser.sleep(1000);

    page.getCell(0,0).click();

    waitForUrlContains('sessions/');
    expectUrlToContain('sessions/');
  });


  it('should render session id', () => {
    browser.sleep(2000);

    expectPresent(view.getEntityNameHeader());
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(2);
  })
});
