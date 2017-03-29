import {AuthPage} from './po/auth.po';
import {browser} from 'protractor';
import {DashboardPage} from './po/dashboard.po';
import {
  waitForUrlContains, waitForPresenceOf, navigateToHomepage, expectPresent, expectUrlToContain,
  expectUrlToEqual
} from './utils';

describe('Login', function() {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;

  beforeEach(() => {
    authPage = new AuthPage();
    dashboardPage = new DashboardPage();
    browser.waitForAngularEnabled(true);
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

    browser.sleep(2000);
    browser.waitForAngularEnabled(false);

    doLogin(authPage, 'nikola.bosic@toptal.com', '123456789');

    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
    waitForUrlContains('dashboard');

    expectUrlToContain('/dashboard');
  });

  it ('should navigate to /dashboard when valid token is present in local storage', () => {
    navigateToHomepage();

    expectUrlToContain('/dashboard');
  });

  it ('should display Auth0 lock and navigate to / when user logs out', () => {
    navigateToHomepage();

    dashboardPage.getCollapsedMenuButton().click();
    dashboardPage.getCollapsedMenuItems().last().click();

    expectUrlToEqual('http://localhost:4200/');
    expectPresent(authPage.getAuth0Lock());
  })
});

function doLogin(authPage: AuthPage, email: string, password: string) {
  authPage.getEmailInput().sendKeys(email);
  authPage.getPasswordInput().sendKeys(password);
  authPage.getLoginButton().click();
}

function waitForPresenceOfLoginFields(authPage: AuthPage) {
  waitForPresenceOf(authPage.getEmailInput());
  waitForPresenceOf(authPage.getPasswordInput());
  waitForPresenceOf(authPage.getLoginButton());
}
