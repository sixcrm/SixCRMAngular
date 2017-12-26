import {waitForUrlContains, navigateSuperuserToHomepage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
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

  it('should navigate to users page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(29).click();
    browser.sleep(500);
    sidenav.getLink(30).click();
    waitForUrlContains('user');
    expectUrlToContain('user');
  });

  it('should render users index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render users index title', () => {
    expect(page.getTitle().getText()).toContain('Users')
  });

  it('should render users index add button', () => {
    expectPresent(page.getAddButton());
  });

  it('should render users index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Email');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Active');
    expect(page.getTableHeaders().get(3).getText()).toEqual('Terms and Conditions');
  });

  it('should open user when clicked clicked', () => {
    browser.sleep(3000);
    selectedUser = page.getCell(0,0).getText();

    page.getCell(0,0).click();

    waitForUrlContains('users/');
    expectUrlToContain('users/');
  });


  it('should render correct user name', () => {
    browser.sleep(1000);

    expect(view.getEntityNameHeaderSolo().getText()).toEqual(selectedUser)
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(1);
  })
});
