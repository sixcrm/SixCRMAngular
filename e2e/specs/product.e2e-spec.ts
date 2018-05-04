import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectPresent} from '../utils/assertation.utils';
import {ProductPage} from '../po/product.po';

describe('Products', function() {
  let page: EntityIndexPage;
  let productPage: ProductPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    productPage = new ProductPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should navigate to products page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(17).click();
    browser.sleep(500);
    sidenav.getLink(19).click();
    waitForUrlContains('products');
    expectUrlToContain('products');
  });

  it('should render products index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render products index title', () => {
    expect(page.getTitle().getText()).toContain('Products');
  });

  it('should render products index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();
    expectDefined(productPage.getNewProductForm());
  });

  it('should show show errors when try to submit empty form', () => {
    productPage.getNewProductSaveButton().click();
    expect(productPage.getErrorInputs().count()).toBeGreaterThan(1);
  });

  it('should remove errors when form is valid', () => {
    productPage.getNewProductInputs().get(0).sendKeys('e2e product');
    productPage.getNewProductInputs().get(1).sendKeys('e2esku');
    expect(productPage.getErrorInputs().count()).toEqual(0);
  });

  it('should create new product and redirect product view', () => {
    productPage.getNewProductSaveButton().click();
    waitForUrlContains('products/');
    expectUrlToContain('products/');
  });

  it('should display product details', () => {
    browser.sleep(2000);
    expect(productPage.getProductName().getText()).toEqual('e2e product');
  });

  it('should update product', () => {
    productPage.getDetailsMenuButton().click();
    browser.sleep(500);
    productPage.getMenuButton(0).click();
    browser.sleep(200);
    productPage.getEditProductInputs().get(0).sendKeys(' updated');
    productPage.getProductDescriptionInput().sendKeys('e2e Product Description updated');
    productPage.getEditProductInputs().get(1).sendKeys(' updated');
    productPage.getEditProductInputs().get(2).sendKeys('1000');
    browser.sleep(500);
    productPage.getNewProductSaveButton().click();
  });

  it('should persist updated product details', () => {
    browser.sleep(1000);
    expect(productPage.getProductName().getText()).toEqual('e2e product updated');
  });

  it('should delete product and navigate back to index', () => {
    productPage.getDetailsMenuButton().click();
    browser.sleep(500);
    productPage.getMenuButton(1).click();
    browser.sleep(200);
    expect(productPage.getDeletionModalContent().getText()).toEqual('Are you sure you want to delete?\n');
  });

  it('should go to products details', () => {
    const sidenav = new SidenavPage();
    productPage.getDeletionModalButton().click();
    sidenav.getLink(17).click();
    browser.sleep(500);
    sidenav.getLink(19).click();
    browser.sleep(2000);
    waitForUrlContains('products');
    productPage.getProductFromTable(1).click();
    browser.sleep(500);
    expectUrlToContain('products');
    expectUrlToContain('products');
  });

  it('should go to images and upload an image', () => {

  });

  it('should go schedules and add a new schedule', () => {
  });

  it('should go to campaigns', () => {
  });

  it('should go to merchant group associations', () => {
  });

});
