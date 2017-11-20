import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';

describe('Campaigns', function() {
  let page: EntityIndexPage;

  beforeEach(() => {
    page = new EntityIndexPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should navigate to campaigns page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(15).click();
    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should render campaigns index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render campaigns index title', () => {
    expect(page.getTitle().getText()).toContain('Campaigns')
  });

  it('should render campaigns index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render campaigns index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Total products');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Total Scheduled');
    expect(page.getTableHeaders().get(3).getText()).toEqual('Created at');
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();
  });
});
