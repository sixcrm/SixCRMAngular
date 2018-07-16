import {browser, protractor, ElementFinder} from 'protractor';
import {AuthPage} from '../po/auth.po';
import {createTestAuth0JWT, getJwtContent} from './jwt.utils';

export function navigateSuperuserToHomepage() {
  browser.get('/');
  addSuperUserToken();
  browser.get('/');
  waitForUrlContains('dashboard');
}

export function addSuperUserToken() {
  let jwt = createTestAuth0JWT('super.user@test.com');
  let content = getJwtContent('super.user@test.com');

  addToLocalStorage(jwt, content);
}

export function clearLocalStorage() {
  browser.executeScript(`window.localStorage.clear();`);
}

export function addToLocalStorage(token: string, payload: any) {
  browser.executeScript(`return window.localStorage.setItem('id_token','${token}');`);
  browser.executeScript(`return window.localStorage.setItem('id_token_payload','${JSON.stringify(payload)}');`);
}

export function waitForPresenceOf(element: ElementFinder, timeout = 10000) {
  browser
    .wait(
      protractor.ExpectedConditions.presenceOf(element),
      timeout,
      `Element ${element.locator()} is not present after ${timeout} ms`
    );
}

export function waitForNotPresenceOf(element: ElementFinder, timeout = 10000) {
  browser
    .wait(
      protractor.ExpectedConditions.stalenessOf(element),
      timeout,
      `Element ${element.locator()} is present after ${timeout} ms`
  );
}

export function waitForUrlContains(partialUrl: string, timeout = 10000) {
  browser
    .wait(
      protractor.ExpectedConditions.urlContains(partialUrl),
      timeout,
      `Url does not contain ${partialUrl} after ${timeout} ms`
    );
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

export function waitForElementToBeClickable(element: ElementFinder, timeout = 10000) {
  browser
    .wait(
      protractor.ExpectedConditions.elementToBeClickable(element),
      timeout,
      `Element ${element.locator()} is not clickable after ${timeout} ms`
    );
}

export function waitForVisibilityOf(element: ElementFinder, timeout = 10000) {
  browser
    .wait(
      protractor.ExpectedConditions.visibilityOf(element),
      timeout,
      `Element ${element.locator()} is not visible after ${timeout} ms`
    );
}
