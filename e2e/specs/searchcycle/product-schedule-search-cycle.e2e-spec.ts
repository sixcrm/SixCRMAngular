import {EntityIndexPage} from '../../po/entity-index.po';
import {SearchPage} from '../../po/search.po';
import {browser, protractor} from 'protractor';
import {clearLocalStorage, waitForUrlContains, waitForPresenceOf} from '../../utils/navigation.utils';
import {login} from '../../utils/action.utils';
import {NavPage} from '../../po/sidenav.po';
import {expectUrlToContain} from '../../utils/assertation.utils';
import {generateLetters} from '../../utils/generator.utils';
import {TopnavPage} from '../../po/topnav.po';
import {ProductSchedulePage} from '../../po/product-schedule.po';

describe('ProductScheduleSearchCycle', function() {
  let page: EntityIndexPage;
  let productSchedulePage: ProductSchedulePage;
  let searchPage: SearchPage;
  let sidenav: NavPage;
  let topnav: TopnavPage;

  const productScheduleName = generateLetters(12);

  beforeEach(() => {
    page = new EntityIndexPage();
    productSchedulePage = new ProductSchedulePage();
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

  it('should create new product schedule', () => {
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(14).click();
    waitForUrlContains('productschedules');

    page.getAddButton().click();

    productSchedulePage.getNewProductScheduleInputs().get(0).sendKeys(productScheduleName);
    productSchedulePage.getNewProductScheduleInputs().get(1).click();
    browser.sleep(1500);
    productSchedulePage.getAutoCompleteOption().click();

    browser.sleep(200);

    productSchedulePage.getNewProductScheduleSaveButton().click();

    browser.sleep(1500);
    expect(productSchedulePage.getProductScheduleName().getText()).toEqual(productScheduleName);
  });

  it('wait for 90 seconds and perform search', () => {
    browser.sleep(90000);

    topnav.getSearchButton().click();
    browser.sleep(300);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(productScheduleName);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('search');
    expectUrlToContain('search');
  });

  it('should find newly created product schedule when search by product schedule name', () => {
    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should open product schedule view when clicked on search result', () => {
    searchPage.getOneSearchResult().click();

    browser.sleep(2000);

    waitForUrlContains('productschedules');
    expectUrlToContain('productschedules');

    expect(productSchedulePage.getProductScheduleName().getText()).toEqual(productScheduleName);

  })

});
