import {AuthPage} from '../po/auth.po';
import {expectUrlToContain} from './assertation.utils';
import {waitForUrlContains, waitForPresenceOfLoginFields} from './navigation.utils';
import {browser} from 'protractor';

let username = 'nikola.bosic@toptal.com';
let password = '123456789';

export function doLogin(authPage: AuthPage, email: string, password: string) {
  authPage.getEmailInput().sendKeys(email);
  authPage.getPasswordInput().sendKeys(password);
  authPage.getLoginButton().click();
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

export function login() {
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
