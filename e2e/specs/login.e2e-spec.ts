///<reference path="../po/dashboard.po.ts"/>
import {AuthPage} from '../po/auth.po';
import {browser} from 'protractor';
import {DashboardPage} from '../po/dashboard.po';
import {
  waitForPresenceOfLoginFields, waitForPresenceOf, waitForUrlContains,
  navigateSuperuserToHomepage, clearLocalStorage
} from '../utils/navigation.utils';
import {doLogin, doTOSCheck} from '../utils/action.utils';
import {expectPresent, expectUrlToContain} from '../utils/assertation.utils';

describe('Login', function() {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    authPage = new AuthPage();
    dashboardPage = new DashboardPage();
    browser.waitForAngularEnabled(true);
    browser.get('/');
    clearLocalStorage();
  });

  it ('should fail login when wrong email and password are used', () => {
    authPage.navigateTo();
    waitForPresenceOfLoginFields(authPage);
    // Email and password are in DOM, but may still not be visible
    browser.sleep(2000);
    // Email field input triggers some asynchronous call that never gets resolved, so we tell protractor not to wait for it
    browser.waitForAngularEnabled(false);
    doLogin(authPage, `wrongemail${Math.random()}@example.com`, 'wrongpassword');
    // Wait for angular is disabled, so we need to tell protractor to wait for error message
    waitForPresenceOf(authPage.getErrorMessage());
    expectPresent(authPage.getErrorMessage());
  });

  it ('should login and navigate to /dashboard when correct email and password are used', () => {
    authPage.navigateTo();
    waitForPresenceOfLoginFields(authPage);
    browser.sleep(1200);
    browser.waitForAngularEnabled(false);
    doLogin(authPage, 'e2e-test-admin@sixcrm.com', '123456789');
    browser.sleep(2000);
    doTOSCheck();
    browser.sleep(2000);
    waitForUrlContains('dashboard');
    expectUrlToContain('/dashboard');
  });

  it ('should login and navigate to /customers when landed on /customers before login', () => {
    browser.get('/customers');
    waitForPresenceOfLoginFields(authPage);
    browser.sleep(1200);
    browser.waitForAngularEnabled(false);
    doLogin(authPage, 'e2e-test-admin@sixcrm.com', '123456789');
    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
    browser.sleep(2000);
    doTOSCheck();
    browser.sleep(1500);
    waitForUrlContains('customers');
    expectUrlToContain('/customers');
  });

  it ('should navigate to /dashboard when valid token is present in local storage', () => {
    navigateSuperuserToHomepage();
    browser.waitForAngularEnabled(false);
    browser.sleep(2000);
    waitForUrlContains('dashboard');
    doTOSCheck();
    browser.sleep(2000);
    expectUrlToContain('/dashboard');
  });

  it ('should display Auth0 lock and navigate to / when user logs out', () => {
    navigateSuperuserToHomepage();
    browser.waitForAngularEnabled(false);
    browser.sleep(1000);
    doTOSCheck();
    browser.sleep(2000);
    dashboardPage.getCollapsedMenuButton().click();
    browser.sleep(600);
    dashboardPage.getCollapsedMenuItems().last().click();
    browser.sleep(1500);
    expectPresent(authPage.getAuth0Lock());

  });
});

