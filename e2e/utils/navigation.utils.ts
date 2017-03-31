import {browser, protractor, ElementFinder} from 'protractor';
import {AuthPage} from '../po/auth.po';
import {createTestAuth0JWT, getJwtContent} from './jwt.utils';

export function navigateSuperuserToHomepage() {
  browser.get('/');
  addSuperUserToken();
  browser.get('/');

  waitForUrlContains('dashboard');
}

export function navigateRegisteruserToRegistration() {
  browser.get('/');
  addRegisterUserToken();
  browser.get('/');

  waitForUrlContains('register');
}

export function navigateRegisteruserToAcceptInvite(link: string) {
  browser.get(link);
  addRegisterUserToken();
  browser.get(link);

  waitForUrlContains('acceptinvite');
}

export function addSuperUserToken() {
  let jwt = createTestAuth0JWT('super.user@test.com');
  let content = getJwtContent('super.user@test.com');

  addToLocalStorage(jwt, content);
}

export function addRegisterUserToken() {
  let jwt = createTestAuth0JWT('testingregistration@example.com');
  let content = getJwtContent('testingregistration@example.com');

  addToLocalStorage(jwt, content);
}

export function clearLocalStorage() {
  browser.executeScript(`window.localStorage.clear();`);
}

export function addToLocalStorage(token: string, payload: any) {
  browser.executeScript(`return window.localStorage.setItem('id_token','${token}');`);
  browser.executeScript(`return window.localStorage.setItem('id_token_payload','${JSON.stringify(payload)}');`);
}

export function waitForPresenceOf(element: ElementFinder, timeout?: number) {
  let to = timeout || 5000;
  browser.wait(protractor.ExpectedConditions.presenceOf(element), to).catch(() => `Element ${element.locator()} is not present after ${to} ms`);
}

export function waitForUrlContains(partialUrl: string, timeout?: number) {
  let to = timeout || 10000;
  browser.wait(protractor.ExpectedConditions.urlContains(partialUrl), to).catch(() => `Url does not contain ${partialUrl} after ${to} ms`);
}

export function waitForPresenceOfLoginFields(authPage: AuthPage) {
  browser.wait(protractor.ExpectedConditions.presenceOf(authPage.getAlternativeLink()), 2000)
    .then(() => {
      browser.sleep(500);
      authPage.getAlternativeLink().click();
      browser.sleep(500);
      waitForFields();
    })
    .catch(() => {
      waitForFields();
    });

  function waitForFields() {
    waitForPresenceOf(authPage.getEmailInput());
    waitForPresenceOf(authPage.getPasswordInput());
    waitForPresenceOf(authPage.getLoginButton());
  }
}
