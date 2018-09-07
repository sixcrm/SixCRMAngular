import {
  clearLocalStorage, waitForUrlContains, waitForPresenceOf, waitForNotPresenceOf, navigateSuperuserToHomepage,
  clearAuth0SSO
} from '../utils/navigation.utils';
import {expectUrlToContain, expectPresent, expectNotPresent} from '../utils/assertation.utils';
import {browser, protractor} from 'protractor';
import {AuthPage} from '../po/auth.po';
import {SearchPage} from '../po/search.po';
import {TopnavPage} from '../po/topnav.po';

describe('Search', function() {

  let authPage: AuthPage;
  let searchPage: SearchPage;
  let topnav: TopnavPage;

  beforeEach(() => {
    authPage = new AuthPage();
    searchPage = new SearchPage();
    topnav = new TopnavPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);
    browser.waitForAngularEnabled(false);
    browser.get('/');
    clearLocalStorage();
    navigateSuperuserToHomepage();
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should navigate to search page', () => {
    browser.get('/search');

    waitForUrlContains('/search');
    expectUrlToContain('/search');
  });

  it ('should navigate to search page when search via topnav', () => {
    browser.get('/dashboard');

    // topnav.getSearchButton().click();
    // browser.sleep(300);

    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys('test');
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('/search?query=test');
    expectUrlToContain('/search?query=test');
  });

  it('should show progress bar and filter values when performing advanced search', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    browser.sleep(600);

    expect(searchPage.getFilterValues().count()).toEqual(4);
    expect(searchPage.getFilterValues().get(0).getText()).toEqual('first');
    expect(searchPage.getFilterValues().get(1).getText()).toEqual('last');
    expect(searchPage.getFilterValues().get(2).getText()).toEqual('portland');
    expect(searchPage.getFilterValues().get(3).getText()).toEqual('1234');
  });

  it('should hide progress bar when advanced search is performed', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForPresenceOf(searchPage.getSpinner());
    waitForNotPresenceOf(searchPage.getSpinner());

    expectNotPresent(searchPage.getSpinner());
  });

  it('should show perfect match advanced search is performed', () => {
    browser.get('/search?query=test');

    waitForUrlContains('/search?query=t');

    waitForPresenceOf(searchPage.getPerfectMatch());
    expectPresent(searchPage.getPerfectMatch());
  });

  it('should perform search and display progress bar when filter value is toggled', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    browser.sleep(300);
    searchPage.getFilterValueButtons().first().click();

    waitForNotPresenceOf(searchPage.getPerfectMatch());
    expectNotPresent(searchPage.getPerfectMatch());
  });

  it('should perform search and display progress bar when category is toggled', () => {
    browser.get('/search?advanced=true&firstname=r');

    waitForUrlContains('/search?advanced=true&firstname=r');

    waitForPresenceOf(searchPage.getOneCheckbox());
    searchPage.getCheckboxes().first().click();

    waitForPresenceOf(searchPage.getSpinner());
    expectPresent(searchPage.getSpinner());
  });

  it('should perform search and show search results when search by query "test"', () => {
    browser.get('/search?query=test');

    waitForUrlContains('/search?query=test');
    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should toggle between table and grid', () => {
    browser.get('/search?query=test');

    waitForUrlContains('/search?query=test');
    waitForPresenceOf(searchPage.getOneSearchResult());

    searchPage.getViewModeToggle().click();
    waitForPresenceOf(searchPage.getOneSearchTableResult());

    expect(searchPage.getTableResults().count()).toBeGreaterThan(0);
    expect(searchPage.getResults().count()).toBe(0);

    searchPage.getViewModeToggle().click();
    waitForPresenceOf(searchPage.getOneSearchResult());

    expect(searchPage.getTableResults().count()).toBe(0);
    expect(searchPage.getResults().count()).toBeGreaterThan(0);
  });

  it('should clear results list when search is empty string', () => {
    browser.get('/search?query=test');

    waitForUrlContains('/search?query=test');
    waitForPresenceOf(searchPage.getOneSearchResult());

    searchPage.getQuickSearchInput().clear();
    searchPage.getQuickSearchButton().click();

    browser.sleep(200);
    expect(searchPage.getResults().count()).toBe(0);
  });

  it('should show suggestions when search', () => {
    browser.get('/search');
    waitForUrlContains('/search');

    searchPage.getQuickSearchInput().sendKeys('e');
    waitForPresenceOf(searchPage.getSuggestions());

    expectPresent(searchPage.getSuggestions());
  });

});
