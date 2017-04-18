import {
  clearLocalStorage, waitForUrlContains,
  waitForPresenceOfLoginFields, waitForPresenceOf, waitForNotPresenceOf
} from '../utils/navigation.utils';
import {expectUrlToContain, expectPresent, expectNotPresent} from '../utils/assertation.utils';
import {browser} from 'protractor';
import {doLogin} from '../utils/action.utils';
import {AuthPage} from '../po/auth.po';
import {SearchPage} from '../po/search.po';
import {AppPage} from '../po/App.po';

let username = 'nikola.bosic@toptal.com';
let password = '123456789';

let username2 = 'e2e-test-user@example.com';
let password2 = 'e2etestuser';

describe('Search', function() {

  let authPage: AuthPage;
  let searchPage: SearchPage;
  let app: AppPage;

  beforeEach(() => {
    authPage = new AuthPage();
    searchPage = new SearchPage();
    app = new AppPage();
  });

  beforeAll(() => {
    login();
  });

  afterAll(() => {
    clearLocalStorage();
  });

  it('should navigate to search page', () => {
    browser.get('/search');

    waitForUrlContains('/search');
    expectUrlToContain('/search');
  });

  it('should show progress bar and filter values when performing advanced search', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    expect(searchPage.getFilterValues().count()).toEqual(4);
    expect(searchPage.getFilterValues().get(0).getText()).toEqual('first');
    expect(searchPage.getFilterValues().get(1).getText()).toEqual('last');
    expect(searchPage.getFilterValues().get(2).getText()).toEqual('portland');
    expect(searchPage.getFilterValues().get(3).getText()).toEqual('1234');

    waitForPresenceOf(app.getProgressBar());
    expectPresent(app.getProgressBar());
  });

  it('should hide progress bar when advanced search is performed', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForPresenceOf(app.getProgressBar());
    waitForNotPresenceOf(app.getProgressBar());

    expectNotPresent(app.getProgressBar());
  });

  it('should perform search and display progress bar when filter value is toggled', () => {
    browser.get('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    waitForUrlContains('/search?advanced=true&firstname=first&lastname=last&city=portland&last_four=1234');

    searchPage.getFilterValues().first().click();

    waitForPresenceOf(app.getProgressBar());
    expectPresent(app.getProgressBar());
  });

  it('should perform search and display progress bar when category is toggled', () => {
    browser.get('/search?advanced=true&firstname=test');

    waitForUrlContains('/search?advanced=true&firstname=test');

    waitForPresenceOf(searchPage.getOneCheckbox());
    searchPage.getCheckboxes().first().click();

    waitForPresenceOf(app.getProgressBar());
    expectPresent(app.getProgressBar());
  });

  it('should perform search and show search results when search by first name = test', () => {
    browser.get('/search?advanced=true&firstname=test');

    waitForUrlContains('/search?advanced=true&firstname=test');
    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
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

    searchPage.getQuickSearchInput().sendKeys('t');
    waitForPresenceOf(searchPage.getSuggestions());

    expectPresent(searchPage.getSuggestions());
  });

});

function login() {
  let authPage = new AuthPage();

  authPage.navigateTo();

  waitForPresenceOfLoginFields(authPage);

  browser.sleep(2000);
  browser.waitForAngularEnabled(false);

  doLogin(authPage, username, password);

  // Wait for angular is disabled, so we need to tell protractor to wait for page to load
  waitForUrlContains('dashboard');

  expectUrlToContain('/dashboard');
}
