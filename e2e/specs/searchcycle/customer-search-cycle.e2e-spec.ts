import {EntityIndexPage} from '../../po/entity-index.po';
import {CustomerPage} from '../../po/customer.po';
import {SearchPage} from '../../po/search.po';
import {browser, protractor} from 'protractor';
import {clearLocalStorage, waitForUrlContains, waitForPresenceOf} from '../../utils/navigation.utils';
import {login} from '../../utils/action.utils';
import {NavPage} from '../../po/sidenav.po';
import {expectUrlToContain} from '../../utils/assertation.utils';
import {generateNumber, generateLetters} from '../../utils/generator.utils';
import {TopnavPage} from '../../po/topnav.po';

describe('CustomerSearchCycle', function() {
  let page: EntityIndexPage;
  let customerPage: CustomerPage;
  let searchPage: SearchPage;
  let sidenav: NavPage;
  let topnav: TopnavPage;

  const customerName = generateLetters();
  const customerLastname = generateLetters();
  const customerPhone = generateNumber(9);
  const customerEmail = `${generateLetters()}@example.com`;
  const customerAddress1 = `${generateNumber(4)} ${generateLetters(6)}`;
  const customerAddress2 = `${generateNumber(4)} ${generateLetters(6)}`;
  const customerCity = generateLetters(8);
  const customerZip = generateNumber(5);

  beforeEach(() => {
    page = new EntityIndexPage();
    customerPage = new CustomerPage();
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

  it('should create new customer', () => {
    sidenav.getLink(11).click();
    browser.sleep(200);
    waitForUrlContains('customers');

    page.getAddButton().click();

    waitForUrlContains('customers');

    customerPage.getNewCustomerInputs().get(0).sendKeys(customerName);
    customerPage.getNewCustomerInputs().get(1).sendKeys(customerLastname);
    customerPage.getNewCustomerInputs().get(2).sendKeys(customerPhone);
    customerPage.getNewCustomerInputs().get(3).sendKeys(customerEmail);
    customerPage.getNewCustomerInputs().get(4).sendKeys(customerAddress1);
    customerPage.getNewCustomerInputs().get(5).sendKeys(customerAddress2);
    customerPage.getNewCustomerInputs().get(6).sendKeys('a');
    browser.sleep(200);
    customerPage.getFirstOption().click();
    customerPage.getNewCustomerInputs().get(7).sendKeys(customerCity);
    customerPage.getNewCustomerInputs().get(8).sendKeys('u');
    browser.sleep(200);
    customerPage.getFirstOption().click();
    customerPage.getNewCustomerInputs().get(9).sendKeys(customerZip);

    browser.sleep(200);

    customerPage.getNewCustomerSaveButton().click();

    browser.sleep(1500);
    expect(customerPage.getCustomerName().getText()).toEqual(`${customerName} ${customerLastname}`)
  });

  it('wait for 90 seconds and perform search', () => {
    browser.sleep(90000);

    topnav.getSearchButton().click();
    browser.sleep(300);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(customerName);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('search');
    expectUrlToContain('search');
  });

  it('should find newly created customer when search by first name', () => {
    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer when search by last name', () => {
    topnav.getSearchButton().click();
    browser.sleep(500);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(customerLastname);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer when search by full name', () => {
    topnav.getSearchButton().click();
    browser.sleep(500);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(`${customerName} ${customerLastname}`);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer when search by address', () => {
    topnav.getSearchButton().click();
    browser.sleep(500);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(customerAddress1);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer when search by city', () => {
    topnav.getSearchButton().click();
    browser.sleep(500);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(customerCity);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer when search by zip code', () => {
    topnav.getSearchButton().click();
    browser.sleep(500);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(customerZip);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer via advanced search by first name', () => {
    browser.get(`/search?advanced=true&firstname=${customerName}`);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer via advanced search by first name and last name', () => {
    browser.get(`/search?advanced=true&firstname=${customerName}&lastname=${customerLastname}`);


    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should find newly created customer via advanced search by first name and last name and zip code', () => {
    browser.get(`/search?advanced=true&firstname=${customerName}&lastname=${customerLastname}&zip=${customerZip}`);

    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should open customer view when clicked on search result', () => {
    searchPage.getOneSearchResult().click();

    browser.sleep(2000);

    waitForUrlContains('search');
    expectUrlToContain('search');

    expect(customerPage.getCustomerName().getText()).toEqual(`${customerName} ${customerLastname}`);
  })

});
