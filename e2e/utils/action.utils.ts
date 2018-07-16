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

export function customLogin(uname: string, pwd: string) {
  authPage.navigateTo();
  waitForPresenceOfLoginFields(authPage);
  browser.sleep(2000);
  browser.waitForAngularEnabled(false);
  doLogin(authPage, uname, pwd);
  // Wait for angular is disabled, so we need to tell protractor to wait for page to load
  waitForUrlContains('dashboard');
  expectUrlToContain('/dashboard');
}

export function tosCheck(doneCallback) {
  // give it some time to appear
  browser.sleep(1500);

  // ask if button is present
  dashboardPage.getTOSButton().isPresent().then((isPresent: boolean) => {
    // if button is present
    if (isPresent) {
      // click on it
      dashboardPage.getTOSButton().click();

      // and call function recursively (for another set of terms and conditions, owner TOS)
      tosCheck(doneCallback);
    } else {
      // if button is not present, then inform test caller that it can be finished
      doneCallback();
    }
  });

}
