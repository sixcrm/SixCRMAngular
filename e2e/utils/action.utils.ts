import {AuthPage} from '../po/auth.po';
import {DashboardPage} from '../po/dashboard.po';
import {expectUrlToContain} from './assertation.utils';
import {waitForUrlContains, waitForPresenceOfLoginFields} from './navigation.utils';
import {browser} from 'protractor';

let username = 'e2e-test-admin@sixcrm.com';
let password = '123456789';

let usernameU = 'e2e-test-user@sixcrm.com';
let passwordU = '123456789';

let authPage = new AuthPage();
let dashboardPage = new DashboardPage();

export function doLogin(authPage: AuthPage, email: string, password: string) {
  authPage.getEmailInput().sendKeys(email);
  authPage.getPasswordInput().sendKeys(password);
  authPage.getLoginButton().click();
  browser.sleep(5000);
}

export function doSignUp(authPage: AuthPage, email: string, password: string) {
  authPage.getSignupButton().click();
  authPage.getEmailInput().sendKeys(email);
  authPage.getPasswordInput().sendKeys(password);
  authPage.getLoginButton().click();
}

export function doRegister(authPage: AuthPage, email: string, password: string) {
  doLogin(authPage, email, password);
}

export function login(user?: boolean) {
  authPage.navigateTo();
  waitForPresenceOfLoginFields(authPage);
  browser.sleep(2000);
  browser.waitForAngularEnabled(false);
  doLogin(authPage, user ? usernameU : username, user ? passwordU : password);
  // Wait for angular is disabled, so we need to tell protractor to wait for page to load
  waitForUrlContains('dashboard');
  expectUrlToContain('/dashboard');
}

export function doTOSCheck() {
  dashboardPage.getTOSButton().click().then(function() {
      browser.sleep(5000);
      waitForUrlContains('dashboard');
      browser.sleep(2000);
      dashboardPage.getTOSButton().click();
      console.log('Found a TOS button');
    },
    function(err) {
      console.log('No TOS button found');
  });
}
