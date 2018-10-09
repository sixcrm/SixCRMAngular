import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectNotPresent} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';
import {login} from '../utils/action.utils';
import {AccountPage} from '../po/account.po';
import {MaterialItems} from '../po/material.items';

describe('Accounts', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;
  let selectedAccount: any;
  let accountPage: AccountPage;
  let material: MaterialItems;

  beforeEach(() => {
    page = new EntityIndexPage();
    view = new EntityViewPage();
    accountPage = new AccountPage();
    material = new MaterialItems();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    login();
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should navigate to accounts page', () => {
    const nav = new NavPage();

    nav.getNavToggler().click();
    nav.getLink(1).click();

    waitForUrlContains('account');
    expectUrlToContain('account');
  });

  it('should render accounts index component', () => {
    browser.sleep(500);
    expectDefined(page.getComponent());
  });

  it('should render accounts index title', () => {
    browser.sleep(10000);
    browser.pause();
    expect(page.getTitle().getText()).toContain('Accounts');
  });

  it('should not render accounts index add button', () => {
    browser.sleep(500);
    expectNotPresent(page.getAddButton());
  });

  it('should open account when clicked clicked', () => {
    browser.sleep(3000);
    selectedAccount = page.getCell(0, 0).getText();

    page.getCell(0, 0).click();

    waitForUrlContains('accounts/');
    expectUrlToContain('accounts/');
  });


  it('should render correct account name', () => {
    browser.sleep(1000);

    expect(view.getEntityNameHeaderSolo().getText()).toEqual(selectedAccount);
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(4);
  });

  it('should render access keys', () => {
    view.getTabLabels().get(2).click();

    browser.sleep(600);

    expect(accountPage.getAccessKeysRows().count()).toEqual(0);
  });

  it('should add access keys pair', () => {
    accountPage.getAccessKeysOptionsButton().click();

    browser.sleep(200);

    material.getMenuButton(0).click();

    browser.sleep(600);
    expect(accountPage.getAccessKeysRows().count()).toEqual(1);
  });

  it('should remove access keys', (doneFunction) => {
    accountPage.getAccessKeysRows().count().then(count => {
      for (let i = 0; i < count; i++) {
        accountPage.getLastAccessKeysButton().click();
        browser.sleep(200);
        material.getMenuButton(2).click();
        browser.sleep(200);
        accountPage.getConfirmDeleteButton().click();
        browser.sleep(2000);
      }

      expect(accountPage.getAccessKeysRows().count()).toBe(0);
      doneFunction();
    });
  });

});
