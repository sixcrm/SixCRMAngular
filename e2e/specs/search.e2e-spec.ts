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

    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys('test');
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('/search?query=test');
    expectUrlToContain('/search?query=test');
  });

  it ('should not throw error when entering \u005C backslash in search', () => {
    browser.get('/dashboard');

    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys('\u005C');
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('/search?query=%5C');
    expectUrlToContain('/search?query=%5C');
  });

  it('should show filter values when performing search', () => {
    browser.get('/dashboard');

    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys('e2e');
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    browser.sleep(2500);

    expect(searchPage.getFilterValues().count()).toEqual(3);
    expect(searchPage.getFilterValues().get(0).getText()).toEqual('Campaign');
    expect(searchPage.getFilterValues().get(1).getText()).toEqual('Product');
    expect(searchPage.getFilterValues().get(2).getText()).toEqual('Product Schedule');
  });

  xit('should hide progress bar when advanced search is performed', () => {
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

  xit('should perform search and display progress bar when filter value is toggled', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    browser.sleep(300);
    searchPage.getFilterValueButtons().first().click();

    waitForNotPresenceOf(searchPage.getPerfectMatch());
    expectNotPresent(searchPage.getPerfectMatch());
  });

  xit('should perform search and display progress bar when category is toggled', () => {
    browser.get('/search?advanced=true&firstname=r');

    waitForUrlContains('/search?advanced=true&firstname=r');

    waitForPresenceOf(searchPage.getOneCheckbox());
    searchPage.getCheckboxes().first().click();

    waitForPresenceOf(searchPage.getSpinner());
    expectPresent(searchPage.getSpinner());
  });

  xit('should perform search and show search results when search by query "test"', () => {
    browser.get('/search?query=test');

    waitForUrlContains('/search?query=test');
    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  xit('should toggle between table and grid', () => {
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

  xit('should clear results list when search is empty string', () => {
    browser.get('/search?query=test');

    waitForUrlContains('/search?query=test');
    waitForPresenceOf(searchPage.getOneSearchResult());

    searchPage.getQuickSearchInput().clear();
    searchPage.getQuickSearchButton().click();

    browser.sleep(200);
    expect(searchPage.getResults().count()).toBe(0);
  });

  xit('should show suggestions when search', () => {
    browser.get('/search');
    waitForUrlContains('/search');

    searchPage.getQuickSearchInput().sendKeys('e');
    waitForPresenceOf(searchPage.getSuggestions());

    expectPresent(searchPage.getSuggestions());
  });

});
