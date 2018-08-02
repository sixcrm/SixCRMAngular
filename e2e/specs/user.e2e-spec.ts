import {waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectPresent} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';

describe('Users', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;
  let selectedUser: any;

  beforeEach(() => {
    page = new EntityIndexPage();
    view = new EntityViewPage();
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

  it('should navigate to accounts page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(2).click();
    waitForUrlContains('users');
    expectUrlToContain('users');
  });

  it('should render users index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render users index title', () => {
    expect(page.getTitle().getText()).toContain('Users');
  });

  it('should render users index add button', () => {
    expectPresent(page.getAddButton());
  });

  it('should open user when clicked clicked', () => {
    browser.sleep(2000);
    selectedUser = page.getCell(0,1 ).getText();
    page.getTableRow(0).click();
    browser.sleep(1500);
    waitForUrlContains('users/');
    expectUrlToContain('users/');
  });

  it('should render correct user name', () => {
    browser.sleep(1500);
    expect(view.getEntityNameHeaderSolo().getText()).toEqual(selectedUser);
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(1);
  });
});
