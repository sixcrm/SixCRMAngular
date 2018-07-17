import { browser } from 'protractor';

import { EntityIndexPage } from '../po/entity-index.po';
import { ProfilePage } from '../po/profile.po';
import { SidenavPage } from '../po/sidenav.po';
import { login } from '../utils/action.utils';
import { clearLocalStorage, waitForElementToBeClickable, waitForUrlContains, waitForVisibilityOf } from '../utils/navigation.utils';
import { AccountPage } from '../po/account.po';

describe('API Keys', function() {
  const sidenavPage = new SidenavPage();
  const page = new EntityIndexPage();
  const profilePage = new ProfilePage();
  const accountPage = new AccountPage();

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to signing strings page', () => {
    waitForElementToBeClickable(sidenavPage.getLink(29));
    sidenavPage.getLink(29).click();
    waitForElementToBeClickable(sidenavPage.getLink(32));
    sidenavPage.getLink(32).click();
    waitForElementToBeClickable(sidenavPage.getLink(33));
    sidenavPage.getLink(33).click();
    waitForUrlContains('profile#signingstrings');
  });

  it('should render signing strings table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Signing String');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Last time used');
  });

  it('should have empty signing strings table', () => {
    expect(profilePage.getSSTableCells().count()).toBe(0);
  });

  it('should add new signing string', () => {
    profilePage.getSSMenuButton().click();
    waitForElementToBeClickable(profilePage.getSSAddButton());
    profilePage.getSSAddButton().click();
    waitForVisibilityOf(profilePage.getSSDialogNameInput());
    profilePage.getSSDialogNameInput().sendKeys('test 123');
    profilePage.getSSDialogSaveButton().click();
    waitForVisibilityOf(profilePage.getSSTableCells().get(0));
    expect(profilePage.getSSTableCells().count()).toBe(4);
    expect(profilePage.getSSTableCells().get(0).getText()).toBe('test 123');
  });

  it('should edit signing string', () => {
    profilePage.getSSFirstRowMenuButton().click();
    waitForElementToBeClickable(profilePage.getSSEditButton());
    profilePage.getSSEditButton().click();
    waitForVisibilityOf(profilePage.getSSDialogNameInput());
    profilePage.getSSDialogNameInput().clear();
    profilePage.getSSDialogNameInput().sendKeys('test 123 1');
    profilePage.getSSDialogSaveButton().click();
    waitForVisibilityOf(profilePage.getSSTableCells().get(0));
    browser.sleep(500);
    expect(profilePage.getSSTableCells().get(0).getText()).toBe('test 123 1');
  });

  it('should remove signing string', () => {
    profilePage.getSSFirstRowMenuButton().click();
    waitForElementToBeClickable(profilePage.getSSRemoveButton());
    profilePage.getSSRemoveButton().click();
    waitForElementToBeClickable(profilePage.getSSDialogDeleteButton());
    profilePage.getSSDialogDeleteButton().click();
    browser.sleep(1000);
    expect(profilePage.getSSTableCells().count()).toBe(0);
  });

  it('should navigate to access keys page', () => {
    waitForElementToBeClickable(sidenavPage.getLink(34));
    sidenavPage.getLink(34).click();
    waitForUrlContains('#accesskeys');
  });

  it('should render access keys table headers', () => {
    waitForVisibilityOf(accountPage.getAKTableHeaderCells().get(0));
    expect(accountPage.getAKTableHeaderCells().get(0).getText()).toEqual('Created');
    expect(accountPage.getAKTableHeaderCells().get(1).getText()).toEqual('Name');
    expect(accountPage.getAKTableHeaderCells().get(2).getText()).toEqual('Access Key');
    expect(accountPage.getAKTableHeaderCells().get(3).getText()).toEqual('Secret Key');
  });

  it('should have empty access keys table', () => {
    expect(accountPage.getAKTableCells().count()).toBe(0);
  });

  it('should add new access key', () => {
    accountPage.getAKMenuButton().click();
    waitForElementToBeClickable(accountPage.getAKAddButton());
    accountPage.getAKAddButton().click();
    waitForVisibilityOf(accountPage.getAKTableCells().get(0));
    expect(accountPage.getAKTableCells().count()).toBe(5);
    expect(accountPage.getAKTableCells().get(1).getText()).toBe('');
  });

  it('should edit access key', () => {
    accountPage.getAKFirstRowMenuButton().click();
    waitForElementToBeClickable(accountPage.getAKEditButton());
    accountPage.getAKEditButton().click();
    waitForVisibilityOf(accountPage.getAKDialogNameInput());
    accountPage.getAKDialogNameInput().sendKeys('test 123');
    accountPage.getAKDialogNoteTextarea().sendKeys('test 123 note');
    accountPage.getAKDialogUpdateButton().click();
    waitForVisibilityOf(accountPage.getAKTableCells().get(1));
    browser.sleep(500);
    expect(accountPage.getAKTableCells().get(1).getText()).toBe('test 123');
  });

  it('should remove access key', () => {
    accountPage.getAKFirstRowMenuButton().click();
    waitForElementToBeClickable(accountPage.getAKRemoveButton());
    accountPage.getAKRemoveButton().click();
    waitForElementToBeClickable(accountPage.getAKDialogDeleteButton());
    accountPage.getAKDialogDeleteButton().click();
    browser.sleep(1000);
    expect(accountPage.getAKTableCells().count()).toBe(0);
  });
});
