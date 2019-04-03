import {waitForUrlContains, clearLocalStorage, waitForPresenceOf, clearAuth0SSO} from '../utils/navigation.utils';
import {tosCheck, customLogin} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectPresent, expectNotPresent} from '../utils/assertation.utils';
import {CreateOrderPage} from '../po/create-order.po';
import {TopnavPage} from '../po/topnav.po';
import {generateString} from '../utils/generator.utils';

describe('New Order', function() {
  let createOrderPage: CreateOrderPage;
  let topnav: TopnavPage;

  beforeEach(() => {
    createOrderPage = new CreateOrderPage();
    topnav = new TopnavPage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    customLogin('e2e-create-order@sixcrm.com', '123456789');
    waitForUrlContains('dashboard');
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should open create order modal', () => {
    topnav.getAddButton().click();
    topnav.getDropdownOptions().first().click();

    expectPresent(createOrderPage.getCreateOrderModalContainer());
  });

  it('should add customer details', () => {
    browser.sleep(2000);

    createOrderPage.getCustomerNewButton().click();

    createOrderPage.getNewCustomerInputs().get(0).sendKeys('Test Customer FN');
    createOrderPage.getNewCustomerInputs().get(1).sendKeys('Test Customer LN');
    createOrderPage.getNewCustomerInputs().get(2).sendKeys('(123) 123-1231');
    createOrderPage.getNewCustomerInputs().get(3).sendKeys(`e2e-customer-${generateString(5)}@sixcrm.com`);
  });

  it('should select customer', () => {
    createOrderPage.getCustomerNextButton().click();
    browser.sleep(500);
    expect(createOrderPage.getCustomerChip().getText()).toContain('Test Customer FN Test Customer LN');
  });

  it('should have preselected campaign', () => {
    createOrderPage.getCampaignNextButton().click();
    browser.sleep(500);
    expect(createOrderPage.getCampaignChip().getText()).toContain('Create Order Campaign');
  });

  it('should have 3 items in products dropdown', () => {
    createOrderPage.getProductsInputSelector().click();
    browser.sleep(500);
    expect(createOrderPage.getMenuOptions().count()).toEqual(3);
  });

  it('should add schedule', () => {
    createOrderPage.getMenuOption(0).click();

    expect(createOrderPage.getProductsChips().count()).toEqual(1);
    expect(createOrderPage.getProductsChip(0).getText()).toContain('A Subscription');
  });

  it('should have only one product item after schedule is added', () => {
    createOrderPage.getProductsInputSelector().click();

    expect(createOrderPage.getMenuOptions().count()).toEqual(1);
  });

  it('should have shipping section disabled when schedule is added', () => {
    expect(createOrderPage.getDisabledPanels().count()).toEqual(1);
  });

  it('should add product along with schedule', () => {
    createOrderPage.getMenuOption(0).click();

    expect(createOrderPage.getProductsChips().count()).toEqual(2);
    expect(createOrderPage.getProductsChip(0).getText()).toContain('A Subscription');
  });

  it('should remove products and schedules', () => {
    createOrderPage.getProductsChipRemove(1).click();
    createOrderPage.getProductsChipRemove(0).click();

    expect(createOrderPage.getProductsChips().count()).toEqual(0);
  });

  it('should have 3 items in products dropdown', () => {
    createOrderPage.getProductsInputSelector().click();
    browser.sleep(500);

    expect(createOrderPage.getMenuOptions().count()).toEqual(3);
  });

  it('should have shipping section enabled when schedule is removed', () => {
    expect(createOrderPage.getDisabledPanels().count()).toEqual(0);
  });

  it('should add product', () => {
    createOrderPage.getMenuOption(2).click();
    browser.sleep(500);

    expect(createOrderPage.getProductsChips().count()).toEqual(1);
    expect(createOrderPage.getProductsChip(0).getText()).toContain('Create Order Product');
  });

  it('should select product', () => {
    createOrderPage.getProductsNextButton().click();
  });

  it('should add address', () => {
    createOrderPage.getNewAddressInputs().get(0).sendKeys('1 test');
    createOrderPage.getNewAddressInputs().get(1).sendKeys('line two');
    createOrderPage.getNewAddressInputs().get(2).sendKeys('New York');
    createOrderPage.getNewAddressInputs().get(3).sendKeys('21000');
    createOrderPage.getNewAddressInputs().get(4).click();
    browser.sleep(500);
    createOrderPage.getFirstMenuOption().click();
    createOrderPage.getNewAddressInputs().get(5).click();
    browser.sleep(500);
    createOrderPage.getFirstMenuOption().click();
  });

  it('should select address', () => {
    createOrderPage.getAddressNextButton().click();
    browser.sleep(500);
    expect(createOrderPage.getAddressChip().getText()).toContain('1 test');
  });

  it('should skip shipping', () => {
    createOrderPage.getShippingNextButton().click();
    browser.sleep(500);
  });

  it('should add billing', () => {
    createOrderPage.getBillingInputs().get(0).sendKeys('4242424242424242');
    createOrderPage.getBillingInputs().get(1).sendKeys('123');
    createOrderPage.getBillingInputs().get(2).sendKeys('Test Customer');
    createOrderPage.getBillingInputs().get(3).click();
    browser.sleep(200);
    createOrderPage.getDateDropdownOptions().get(6).click();
    createOrderPage.getBillingInputs().get(4).click();
    browser.sleep(200);
    createOrderPage.getDateDropdownOptions().get(4).click();
    createOrderPage.getAddressCheckbox().click();
  });

  it('should select billing', () => {
    createOrderPage.getBillingNextButton().click();
    browser.sleep(500);
    expect(createOrderPage.getBillingChip().getText()).toContain('**** 4242');
  });

  it('should display proper address summary', () => {
    expect(createOrderPage.getPreviewAddressItems().get(1).getText()).toContain('Test Customer FN Test Customer LN');
    expect(createOrderPage.getPreviewAddressItems().get(2).getText()).toContain('1 test');
    expect(createOrderPage.getPreviewAddressItems().get(3).getText()).toContain('line two');
    expect(createOrderPage.getPreviewAddressItems().get(4).getText()).toContain('New York, Alabama 21000');
    expect(createOrderPage.getPreviewAddressItems().get(5).getText()).toContain('United States');
  });

  it('should display proper payment summary', () => {
    expect(createOrderPage.getPreviewPaymentItems().get(0).getText()).toContain('$1.00');
    expect(createOrderPage.getPreviewPaymentItems().get(1).getText()).toContain('$0.00');
    expect(createOrderPage.getPreviewPaymentItems().get(2).getText()).toContain('$1.00');
  });

  it('should display proper product summary', () => {
    expect(createOrderPage.getProductName(0).getText()).toContain('Create Order Product');
  });

  it('should submit the order and display processing overlay', () => {
    createOrderPage.getSubmitButton().click();
    browser.sleep(500);
    expectPresent(createOrderPage.getProcessingOverlay());
  });

  it('should show order success details', () => {
    waitForPresenceOf(createOrderPage.getOrderCompleteContainer());
    expectPresent(createOrderPage.getOrderCompleteContainer());
  });

  it('should close modal on success', () => {
    createOrderPage.getOrderCompleteDoneButton().click();
    expectNotPresent(createOrderPage.getCreateOrderModalContainer());
  });

  it('should open create order modal again and select a product schedule', () => {
    browser.sleep(2000);
    topnav.getAddButton().click();
    topnav.getDropdownOptions().first().click();

    browser.sleep(2000);

    createOrderPage.getCustomerNewButton().click();

    createOrderPage.getNewCustomerInputs().get(0).sendKeys('Test Customer FN');
    createOrderPage.getNewCustomerInputs().get(1).sendKeys('Test Customer LN');
    createOrderPage.getNewCustomerInputs().get(2).sendKeys('(123) 123-1231');
    createOrderPage.getNewCustomerInputs().get(3).sendKeys(`e2e-customer-${generateString(5)}@sixcrm.com`);

    createOrderPage.getCustomerNextButton().click();
    browser.sleep(500);

    createOrderPage.getCampaignNextButton().click();
    browser.sleep(500);

    createOrderPage.getProductsInputSelector().click();
    browser.sleep(500);
    createOrderPage.getMenuOption(0).click();
    browser.sleep(500);

    createOrderPage.getProductsNextButton().click();

    createOrderPage.getNewAddressInputs().get(0).sendKeys('1 test');
    createOrderPage.getNewAddressInputs().get(1).sendKeys('line two');
    createOrderPage.getNewAddressInputs().get(2).sendKeys('New York');
    createOrderPage.getNewAddressInputs().get(3).sendKeys('21000');
    createOrderPage.getNewAddressInputs().get(4).click();
    browser.sleep(500);
    createOrderPage.getFirstMenuOption().click();
    createOrderPage.getNewAddressInputs().get(5).click();
    browser.sleep(500);
    createOrderPage.getFirstMenuOption().click();
    createOrderPage.getAddressNextButton().click();
    browser.sleep(500);

    createOrderPage.getBillingInputs().get(0).sendKeys('4242424242424242');
    createOrderPage.getBillingInputs().get(1).sendKeys('123');
    createOrderPage.getBillingInputs().get(2).sendKeys('Test Customer');
    createOrderPage.getBillingInputs().get(3).click();
    browser.sleep(200);
    createOrderPage.getDateDropdownOptions().get(6).click();
    createOrderPage.getBillingInputs().get(4).click();
    browser.sleep(200);
    createOrderPage.getDateDropdownOptions().get(4).click();
    createOrderPage.getAddressCheckbox().click();

    createOrderPage.getBillingNextButton().click();
    browser.sleep(500);

    expect(createOrderPage.getProductName(0).getText()).toContain('A Subscription');

    createOrderPage.getSubmitButton().click();
    browser.sleep(500);

    expectPresent(createOrderPage.getProcessingOverlay());
  });

  it('should show order success details for product schedule', () => {
    waitForPresenceOf(createOrderPage.getOrderCompleteContainer());
    expectPresent(createOrderPage.getOrderCompleteContainer());
  });

  it('should close modal on success for product schedule', () => {
    createOrderPage.getOrderCompleteDoneButton().click();
    expectNotPresent(createOrderPage.getCreateOrderModalContainer());
  });


  it('should open create order modal again and select a product and a product schedule', () => {
    browser.sleep(2000);
    topnav.getAddButton().click();
    topnav.getDropdownOptions().first().click();

    browser.sleep(2000);

    createOrderPage.getCustomerNewButton().click();

    createOrderPage.getNewCustomerInputs().get(0).sendKeys('Test Customer FN');
    createOrderPage.getNewCustomerInputs().get(1).sendKeys('Test Customer LN');
    createOrderPage.getNewCustomerInputs().get(2).sendKeys('(123) 123-1231');
    createOrderPage.getNewCustomerInputs().get(3).sendKeys(`e2e-customer-${generateString(5)}@sixcrm.com`);

    createOrderPage.getCustomerNextButton().click();
    browser.sleep(500);

    createOrderPage.getCampaignNextButton().click();
    browser.sleep(500);

    createOrderPage.getProductsInputSelector().click();
    browser.sleep(500);
    createOrderPage.getMenuOption(0).click();
    browser.sleep(500);

    createOrderPage.getProductsInputSelector().click();
    browser.sleep(500);
    createOrderPage.getMenuOption(0).click();
    browser.sleep(500);

    createOrderPage.getProductsNextButton().click();

    createOrderPage.getNewAddressInputs().get(0).sendKeys('1 test');
    createOrderPage.getNewAddressInputs().get(1).sendKeys('line two');
    createOrderPage.getNewAddressInputs().get(2).sendKeys('New York');
    createOrderPage.getNewAddressInputs().get(3).sendKeys('21000');
    createOrderPage.getNewAddressInputs().get(4).click();
    browser.sleep(500);
    createOrderPage.getFirstMenuOption().click();
    createOrderPage.getNewAddressInputs().get(5).click();
    browser.sleep(500);
    createOrderPage.getFirstMenuOption().click();
    createOrderPage.getAddressNextButton().click();
    browser.sleep(500);

    createOrderPage.getBillingInputs().get(0).sendKeys('4242424242424242');
    createOrderPage.getBillingInputs().get(1).sendKeys('123');
    createOrderPage.getBillingInputs().get(2).sendKeys('Test Customer');
    createOrderPage.getBillingInputs().get(3).click();
    browser.sleep(200);
    createOrderPage.getDateDropdownOptions().get(6).click();
    createOrderPage.getBillingInputs().get(4).click();
    browser.sleep(200);
    createOrderPage.getDateDropdownOptions().get(4).click();
    createOrderPage.getAddressCheckbox().click();

    createOrderPage.getBillingNextButton().click();
    browser.sleep(500);

    expect(createOrderPage.getProductName(0).getText()).toContain('A Subscription');
    expect(createOrderPage.getProductName(1).getText()).toContain('Create Order Product');

    createOrderPage.getSubmitButton().click();
    browser.sleep(500);

    expectPresent(createOrderPage.getProcessingOverlay());
  });

  it('should show order success details for a product and a product schedule', () => {
    waitForPresenceOf(createOrderPage.getOrderCompleteContainer());
    expectPresent(createOrderPage.getOrderCompleteContainer());
  });

  it('should close modal on success for a product and a product schedule', () => {
    createOrderPage.getOrderCompleteDoneButton().click();
    expectNotPresent(createOrderPage.getCreateOrderModalContainer());
  });

});
