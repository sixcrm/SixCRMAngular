import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {NavPage} from '../po/nav.po';
import {login, tosCheck} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {ProductPage} from '../po/product.po';
import {ProductAndScheduleIndexPage} from '../po/product-and-schedule.po';

describe('Products', function() {
  let page: ProductAndScheduleIndexPage;
  let productPage: ProductPage;

  beforeEach(() => {
    page = new ProductAndScheduleIndexPage();
    productPage = new ProductPage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should navigate to products page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(10).click();
    waitForUrlContains('products');
    expectUrlToContain('products');
  });

  it('should render products index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render 0 products and schedules', () => {
    browser.sleep(2000);
    expect(page.getCards().count()).toEqual(0);
  });

  it('should create new product', () => {
    page.getAddButton().click();

    waitForUrlContains('/products/product');
    expectUrlToContain('/products/product');
  });

  it('should change product name', () => {
    browser.sleep(2000);

    productPage.getProductNameInput().sendKeys(' e2e');
    productPage.getSaveProductGeneralButton().click();

    browser.sleep(2000);

    expect(productPage.getProductName().getText()).toContain(' e2e');
  });

  it('should create schedule from a product', () => {
    productPage.getCreateScheduleButton().click();

    waitForUrlContains('/products/schedule');
    expectUrlToContain('/products/schedule');
  });

  it('should create schedule with correct name', () => {
    browser.sleep(2000);

    expect(productPage.getProductName().getText()).toContain(' e2e Subscription');
  });

  it('should go back to index page', () => {
    page.getBreadcrumbAt(0).click();

    browser.sleep(2000);

    expectDefined(page.getComponent());
  });

  it('should have two cards', () => {
    expect(page.getCards().count()).toEqual(2);
  });

  it('should select a card', () => {
    page.getCardAt(0).click();

    expect(page.getBulkSelector()).toBeDefined();
    expect(page.getAllSelectedCard().count()).toEqual(1);
  });

  it('should select all cards', () => {
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkSelectAllOption().click();
    page.getBulkApply().click();

    expect(page.getAllSelectedCard().count()).toEqual(2);
  });

  it('should bulk copy all cards', () => {
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkCopyOption().click();
    page.getBulkApply().click();

    browser.sleep(3000);

    expect(page.getCards().count()).toEqual(4);
    expect(page.getAllSelectedCard().count()).toEqual(2);
  });

  it('should deselect all cards', () => {
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkDeselectAllOption().click();
    page.getBulkApply().click();

    expect(page.getAllSelectedCard().count()).toEqual(0);
  });

  it('should filter by "subscription" string', () => {
    page.getFilterInput().sendKeys('subscription');

    expect(page.getCards().count()).toEqual(2);
  });

  it('should filter by "random" string', () => {
    page.getFilterInput().sendKeys('random');

    expect(page.getCards().count()).toEqual(0);
  });

  it('should filter "new" string', () => {
    page.getFilterInput().clear().then(() =>  page.getFilterInput().sendKeys('new'));

    browser.sleep(1000);

    expect(page.getCards().count()).toEqual(4);
  });

  it('should display only schedules on show filter', () => {
    page.getShowFilter().click();
    browser.sleep(1000);

    page.getShowSchedulesItem().click();
    browser.sleep(1000);

    expect(page.getCards().count()).toEqual(2);
  });

  it('should bulk delete schedules', () => {
    page.getCardAt(0).click();
    browser.sleep(500);
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkSelectAllOption().click();
    page.getBulkApply().click();
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkDeleteOption().click();
    page.getBulkApply().click();
    page.getConfirmDeleteButton().click();

    browser.sleep(5000);
    expect(page.getCards().count()).toEqual(0);
  });

  it('should display only products on show filter', () => {
    page.getShowFilter().click();
    browser.sleep(1000);

    page.getShowProductsItem().click();
    browser.sleep(1000);

    expect(page.getCards().count()).toEqual(2);
  });

  it('should bulk delete products', () => {
    page.getCardAt(0).click();
    browser.sleep(500);
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkSelectAllOption().click();
    page.getBulkApply().click();
    page.getBulkOptions().click();
    browser.sleep(200);
    page.getBulkDeleteOption().click();
    page.getBulkApply().click();
    page.getConfirmDeleteButton().click();

    browser.sleep(5000);
    expect(page.getCards().count()).toEqual(0);
  });

  it('should display 0 product and schedule on show all filter', () => {
    page.getShowFilter().click();
    browser.sleep(200);

    page.getShowAllItem().click();
    expect(page.getCards().count()).toEqual(0);
  });

});
