import {waitForUrlContains, navigateSuperuserToHomepage, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectNotPresent} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';

describe('Rebill', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;
  let rebillId: any;

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

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to rebills page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(3).click();
    waitForUrlContains('rebills');
    expectUrlToContain('rebill');
  });

  it('should render rebills index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render rebills index title', () => {
    expect(page.getTitle().getText()).toContain('Rebills')
  });

  it('should not render rebills index add button', () => {
    expectNotPresent(page.getAddButton());
  });

  it('should render rebills index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('ID');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Bill at');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Created at');
    expect(page.getTableHeaders().get(3).getText()).toEqual('Amount');
  });

  it('should open rebill when clicked clicked', () => {
    browser.sleep(1000);

    rebillId = page.getCell(0,0).getText();
    page.getCell(0,0).click();

    waitForUrlContains('rebills/');
    expectUrlToContain('rebills/');
  });

  it('should render correct rebill id', () => {
    browser.sleep(2000);

    expect(view.getEntityNameHeader().getText()).toEqual(rebillId);
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(2);
  })
});
