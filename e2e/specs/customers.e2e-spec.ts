import { browser } from 'protractor';

import { generateUUID } from '../../src/app/shared/utils/queries/entities/entities-helper.queries';
import { AppPage } from '../po/app.po';
import { CustomerPage } from '../po/customer.po';
import { EntityIndexPage } from '../po/entity-index.po';
import { NavPage } from '../po/nav.po';
import { login } from '../utils/action.utils';
import { expectDefined, expectUrlToContain } from '../utils/assertation.utils';
import {
  clearLocalStorage,
  waitForElementToBeClickable,
  waitForNotPresenceOf,
  waitForPresenceOf,
  waitForUrlContains,
  waitForVisibilityOf,
} from '../utils/navigation.utils';

describe('Customers', function() {
  let page: EntityIndexPage;
  let customerPage: CustomerPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    customerPage = new CustomerPage();
  });

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

  it('should navigate to customers index page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(1).click();
    browser.sleep(200);
    waitForUrlContains('customers');
  });

  it('should render customers index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render customers index title', () => {
    expect(page.getTitle().getText()).toContain('Customers')
  });

  it('should render customers index button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render customers index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('First Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Last Name');
    expect(page.getTableHeaders().get(2).getText()).toEqual('State');
    expect(page.getTableHeaders().get(3).getText()).toEqual('City');
  });

  it('should open add new customer form when click on button', () => {
    page.getAddButton().click();

    expectDefined(customerPage.getNewCustomerForm());
    expect(customerPage.getNewCustomerInputs().count()).toEqual(10);
  });

  it('should add new customer', () => {
    const appPage = new AppPage();
    waitForUrlContains('customers');

    const customerName = 'Customer Test fn';
    const customerLastname = 'Customer Test ln';

    customerPage.getNewCustomerInputs().get(0).sendKeys(customerName);
    customerPage.getNewCustomerInputs().get(1).sendKeys(customerLastname);
    customerPage.getNewCustomerInputs().get(2).sendKeys('123456789');
    customerPage.getNewCustomerInputs().get(3).sendKeys('testcustomer@example.com');
    customerPage.getNewCustomerInputs().get(4).sendKeys('1 test customer address');
    customerPage.getNewCustomerInputs().get(5).sendKeys('two test customer address');
    customerPage.getNewCustomerInputs().get(6).sendKeys('a');
    browser.sleep(200);
    customerPage.getFirstOption().click();
    customerPage.getNewCustomerInputs().get(7).sendKeys('test customer city');
    customerPage.getNewCustomerInputs().get(8).sendKeys('u');
    browser.sleep(200);
    customerPage.getFirstOption().click();
    customerPage.getNewCustomerInputs().get(9).sendKeys('21000');

    browser.sleep(200);

    customerPage.getNewCustomerSaveButton().click();

    waitForPresenceOf(customerPage.getCustomerName());
    waitForNotPresenceOf(appPage.getProgressBar());
    browser.sleep(200);
    expect(customerPage.getCustomerName().getText()).toEqual(`${customerName} ${customerLastname}`)
  });

  it('should open customer view customer', () => {
    expectUrlToContain('customers/');
  });

  it('should update customer', () => {
    customerPage.getCustomerUpdateButton().click();
    browser.sleep(100);

    const firstNameSuffix = generateUUID().substring(0,2);
    const lastNameSuffix = generateUUID().substring(0,2);

    customerPage.getCustomerNameInput().sendKeys(firstNameSuffix);
    customerPage.getCustomerLastNameInput().sendKeys(lastNameSuffix);

    customerPage.getCustomerUpdateButton().click();
    browser.sleep(1000);

    expect(customerPage.getCustomerFullName().getText()).toContain(firstNameSuffix);
    expect(customerPage.getCustomerFullName().getText()).toContain(lastNameSuffix);
  });

  it('should add new note', () => {
    const noteText = 'new note text ' + generateUUID();

    customerPage.getCustomerNotesMenu().click();
    browser.sleep(500);
    customerPage.getFirstMenuButton().click();
    browser.sleep(200);

    customerPage.getNoteTextArea().sendKeys(noteText);
    customerPage.getConfirmNoteButton().click();
    browser.sleep(1000);

    expect(customerPage.getFirstNoteText().getText()).toEqual(noteText);
  });

  it('should delete new note', () => {
    customerPage.getFirstNoteMenuButton().click();
    browser.sleep(200);
    customerPage.getFirstMenuButton().click();
    browser.sleep(200);
    customerPage.getConfirmDeleteButton().click();
    browser.sleep(1000);

    expect(customerPage.getNotes().count()).toBe(0);
  });

  it('should add card 1 to billing information', () => {
    waitForElementToBeClickable(customerPage.getBillingMenuButton());
    customerPage.getBillingMenuButton().click();
    waitForElementToBeClickable(customerPage.getBillingAddCardButton());
    customerPage.getBillingAddCardButton().click();
    customerPage.getBillingInputs().get(0).sendKeys('Name on Card');
    customerPage.getBillingInputs().get(1).sendKeys('4111111111111111');
    customerPage.getBillingInputs().get(2).sendKeys('999');
    customerPage.getBillingInputs().get(4).sendKeys('1 test customer address');
    customerPage.getBillingInputs().get(5).sendKeys('two test customer address');
    customerPage.getBillingInputs().get(6).sendKeys('City');
    customerPage.getBillingInputs().get(7).sendKeys('21000');
    const expirationMonth = customerPage.getBillingSelects().get(0);
    expirationMonth.click();
    customerPage.getSelectOptions(expirationMonth).get(5).click();
    const expirationYear = customerPage.getBillingSelects().get(1);
    expirationYear.click();
    customerPage.getSelectOptions(expirationYear).get(2).click();
    const state = customerPage.getBillingSelects().get(2);
    state.click();
    customerPage.getSelectOptions(state).get(4).click();
    const country = customerPage.getBillingSelects().get(3);
    country.click();
    customerPage.getSelectOptions(country).get(0).click();
    customerPage.getBillingSaveButton().click();

    waitForVisibilityOf(customerPage.getBillingCardInputs().get(0));
    expect(customerPage.getBillingCardInputs().get(0).getAttribute('value')).toBe('1 test customer address');
    expect(customerPage.getBillingCardInputs().get(1).getAttribute('value')).toBe('City');
    expect(customerPage.getBillingCardInputs().get(2).getAttribute('value')).toBe('21000');
    expect(customerPage.getBillingCardInputs().get(3).getAttribute('value')).toBe('Name on Card');
    expect(customerPage.getBillingCardInputs().get(5).getAttribute('value')).toBe('***********1111');
    expect(customerPage.getBillingCardInputs().get(6).getAttribute('value')).toBe('06/19');
  });

  it('should edit card 1 name on card', () => {
    waitForElementToBeClickable(customerPage.getBillingMenuButton());
    customerPage.getBillingMenuButton().click();
    waitForElementToBeClickable(customerPage.getBillingEditCardButton());
    customerPage.getBillingEditCardButton().click();
    customerPage.getBillingInputs().get(0).clear();
    customerPage.getBillingInputs().get(0).sendKeys('Name on Card 1');
    customerPage.getBillingUpdateButton().click();

    waitForVisibilityOf(customerPage.getBillingCardInputs().get(3));
    expect(customerPage.getBillingCardInputs().get(3).getAttribute('value')).toBe('Name on Card 1');
  });

  it('should add card 2 to billing information', () => {
    waitForElementToBeClickable(customerPage.getBillingMenuButton());
    customerPage.getBillingMenuButton().click();
    waitForElementToBeClickable(customerPage.getBillingAddCardButton());
    customerPage.getBillingAddCardButton().click();
    customerPage.getBillingInputs().get(0).sendKeys('Name on Card 2');
    customerPage.getBillingInputs().get(1).sendKeys('4111111111111111');
    customerPage.getBillingInputs().get(2).sendKeys('999');
    customerPage.getBillingInputs().get(4).sendKeys('1 test customer address');
    customerPage.getBillingInputs().get(5).sendKeys('two test customer address');
    customerPage.getBillingInputs().get(6).sendKeys('City');
    customerPage.getBillingInputs().get(7).sendKeys('21000');
    const expirationMonth = customerPage.getBillingSelects().get(0);
    expirationMonth.click();
    customerPage.getSelectOptions(expirationMonth).get(5).click();
    const expirationYear = customerPage.getBillingSelects().get(1);
    expirationYear.click();
    customerPage.getSelectOptions(expirationYear).get(2).click();
    const state = customerPage.getBillingSelects().get(2);
    state.click();
    customerPage.getSelectOptions(state).get(4).click();
    const country = customerPage.getBillingSelects().get(3);
    country.click();
    customerPage.getSelectOptions(country).get(0).click();
    customerPage.getBillingSaveButton().click();
  });

  it('should remove card 2', () => {
    waitForElementToBeClickable(customerPage.getBillingCardMenuButtons().get(1));
    customerPage.getBillingCardMenuButtons().get(1).click();
    waitForElementToBeClickable(customerPage.getBillingRemoveCardButton());
    customerPage.getBillingRemoveCardButton().click();
    waitForVisibilityOf(customerPage.getBillingCardInputs().get(0));
    expect(customerPage.getBillingCardMenuButtons().count()).toBe(0);
  });
});
