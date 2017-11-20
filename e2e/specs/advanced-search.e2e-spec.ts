import {AdvancedSearchPage} from '../po/advanced-search.po';
import {
  clearLocalStorage, waitForUrlContains
} from '../utils/navigation.utils';
import {expectUrlToContain} from '../utils/assertation.utils';
import {browser} from 'protractor';
import {login} from '../utils/action.utils';
import {AuthPage} from '../po/auth.po';
import {SearchPage} from '../po/search.po';

describe('Advanced search', function() {

  let authPage: AuthPage;
  let advancedSearchPage: AdvancedSearchPage;
  let searchPage: SearchPage;

  beforeEach(() => {
    authPage = new AuthPage();
    advancedSearchPage = new AdvancedSearchPage();
    searchPage = new SearchPage();
  });

  beforeAll(() => {
    browser.get('/');
    clearLocalStorage();
    login();
  });

  afterAll(() => {
    clearLocalStorage();
  });

  it('should navigate to advanced search page', () => {
    browser.get('/advanced-search');

    waitForUrlContains('/advanced-search');
  });

  it('should display advanced search inputs', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    expect(advancedSearchPage.getSearchInputs().count()).toEqual(14);
  });

  it('should navigate to search results when search by first name', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().first().sendKeys('first');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&firstname=first');

    expectUrlToContain('/search?advanced=true&firstname=first');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('first');
  });

  it('should navigate to search results when search by last name', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(1).sendKeys('last');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&lastname=last');

    expectUrlToContain('/search?advanced=true&lastname=last');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('last');
  });

  it('should navigate to search results when search by phone number', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(2).sendKeys('15122361123');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&phone=15122361123');

    expectUrlToContain('/search?advanced=true&phone=15122361123');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('15122361123');
  });

  it('should navigate to search results when search by email', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(3).sendKeys('email');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&email=email');

    expectUrlToContain('/search?advanced=true&email=email');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('email');
  });

  it('should navigate to search results when search by tracking number', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(4).sendKeys('991912');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&tracking_number=991912');

    expectUrlToContain('/search?advanced=true&tracking_number=991912');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('991912');
  });

  it('should navigate to search results when search by address line1', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(5).sendKeys('line1');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&address_line_1=line1');

    expectUrlToContain('/search?advanced=true&address_line_1=line1');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('line1');
  });

  it('should navigate to search results when search by address line 2', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(6).sendKeys('line2');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&address_line_2=line2');

    expectUrlToContain('/search?advanced=true&address_line_2=line2');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('line2');
  });

  it('should navigate to search results when search by city', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(7).sendKeys('portland');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&city=portland');

    expectUrlToContain('/search?advanced=true&city=portland');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('portland');
  });

  it('should navigate to search results when search by postal code', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(8).sendKeys('21000');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&zip=21000');

    expectUrlToContain('/search?advanced=true&zip=21000');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('21000');
  });

  it('should navigate to search results when search by state', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(9).sendKeys('oregon');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&state=oregon');

    expectUrlToContain('/search?advanced=true&state=oregon');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('oregon');
  });

  it('should navigate to search results when search by transaction alias', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(10).sendKeys('tastdafe124');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&alias=tastdafe124');

    expectUrlToContain('/search?advanced=true&alias=tastdafe124');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('tastdafe124');
  });

  it('should navigate to search results when search by credit card first 6', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(12).sendKeys('654321');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&first_six=654321');

    expectUrlToContain('/search?advanced=true&first_six=654321');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('654321');
  });

  it('should navigate to search results when search by credit card last 4', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(13).sendKeys('1234');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&last_four=1234');

    expectUrlToContain('/search?advanced=true&last_four=1234');
    expect(searchPage.getFilterValues().count()).toEqual(1);
    expect(searchPage.getFilterValues().first().getText()).toEqual('1234');
  });

  it('should navigate to search results when search by multiple fields', () => {
    browser.get('/advanced-search');
    waitForUrlContains('/advanced-search');

    advancedSearchPage.getSearchInputs().get(0).sendKeys('first');
    advancedSearchPage.getSearchInputs().get(1).sendKeys('last');
    advancedSearchPage.getSearchInputs().get(7).sendKeys('portland');
    advancedSearchPage.getSearchInputs().get(13).sendKeys('1234');
    advancedSearchPage.getSearchButton().click();

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    expectUrlToContain('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');
    expect(searchPage.getFilterValues().count()).toEqual(4);
    expect(searchPage.getFilterValues().get(0).getText()).toEqual('first');
    expect(searchPage.getFilterValues().get(1).getText()).toEqual('last');
    expect(searchPage.getFilterValues().get(2).getText()).toEqual('portland');
    expect(searchPage.getFilterValues().get(3).getText()).toEqual('1234');
  });

});
