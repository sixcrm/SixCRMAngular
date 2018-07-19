import {EntityIndexPage} from '../../po/entity-index.po';
import {SearchPage} from '../../po/search.po';
import {browser, protractor} from 'protractor';
import {clearLocalStorage, waitForUrlContains, waitForPresenceOf} from '../../utils/navigation.utils';
import {login} from '../../utils/action.utils';
import {NavPage} from '../../po/sidenav.po';
import {expectUrlToContain} from '../../utils/assertation.utils';
import {generateNumber, generateLetters} from '../../utils/generator.utils';
import {TopnavPage} from '../../po/topnav.po';
import {ProductPage} from '../../po/product.po';

describe('ProductSearchCycle', function() {
  let page: EntityIndexPage;
  let productPage: ProductPage;
  let searchPage: SearchPage;
  let sidenav: NavPage;
  let topnav: TopnavPage;

  const productName = generateLetters(12);
  const productSku = generateNumber(6);

  beforeEach(() => {
    page = new EntityIndexPage();
    productPage = new ProductPage();
    searchPage = new SearchPage();
    sidenav = new NavPage();
    topnav = new TopnavPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should create new product', () => {
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(13).click();
    waitForUrlContains('products');

    page.getAddButton().click();

    productPage.getNewProductInputs().get(0).sendKeys(productName);
    productPage.getNewProductInputs().get(1).sendKeys(productSku);

    browser.sleep(200);

    productPage.getNewProductSaveButton().click();

    browser.sleep(1500);
    expect(productPage.getProductName().getText()).toEqual(productName);
  });

  it('wait for 90 seconds and perform search', () => {
    browser.sleep(90000);

    topnav.getSearchButton().click();
    browser.sleep(300);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(productName);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('search');
    expectUrlToContain('search');
  });

  it('should find newly created product when search by product name', () => {
    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created product when search by product sku', () => {
    topnav.getSearchButton().click();
    browser.sleep(500);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(productSku);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should open product view when clicked on search result', () => {
    searchPage.getOneSearchResult().click();

    browser.sleep(2000);

    waitForUrlContains('products');
    expectUrlToContain('products');

    expect(productPage.getProductName().getText()).toEqual(productName);
  })

});
