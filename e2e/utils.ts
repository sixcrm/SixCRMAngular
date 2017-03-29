import {browser, ElementFinder, protractor} from 'protractor';
import {AuthPage} from './po/auth.po';

export function navigateToHomepage() {
  browser.get('/');
  addTokenToLocalStorage();
  browser.get('/');

  waitForUrlContains('dashboard');
}

export function addTokenToLocalStorage() {
  browser.executeScript(() => localStorage.setItem('id_token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im5pa29sYS5ib3NpY0B0b3B0YWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9mYjJhZGJlZTg0YWM5YmQ2YTZiMTg2MTIyODgxNzc4NT9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm5pLnBuZyIsImlzcyI6Imh0dHBzOi8vc2l4Y3JtLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ODljNDRhNWUzOWJiYjVhZDQ3MjdjZDgiLCJhdWQiOiJKTTF0QzJqN3R5Y2J1NjJlbDNvQmh5a2xwTmJrNXg2RiIsImV4cCI6MTQ5MDgyOTk4MywiaWF0IjoxNDkwNzkzOTgzfQ.gyDqWytw4Xx8TXhdzpejyt-TW5zulv67jLgIGVTBs2o'));
  browser.executeScript(() => localStorage.setItem('access_token', 'OdL6U4CqoqBaNZAl'));
  browser.executeScript(() => localStorage.setItem('id_token_payload', '{"email":"nikola.bosic@toptal.com","email_verified":true,"picture":"https://s.gravatar.com/avatar/fb2adbee84ac9bd6a6b1861228817785?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fni.png","iss":"https://sixcrm.auth0.com/","sub":"auth0|589c44a5e39bbb5ad4727cd8","aud":"JM1tC2j7tycbu62el3oBhyklpNbk5x6F","exp":1490825010,"iat":1490789010}'));
}

export function waitForPresenceOf(element: ElementFinder, timeout?: number) {
  let to = timeout || 5000;
  browser.wait(protractor.ExpectedConditions.presenceOf(element), to).catch(() => `Element ${element.locator()} is not present after ${to} ms`);
}

export function waitForUrlContains(partialUrl: string, timeout?: number) {
  let to = timeout || 10000;
  browser.wait(protractor.ExpectedConditions.urlContains(partialUrl), to).catch(() => `Url does not contain ${partialUrl} after ${to} ms`);
}

export function expectPresent(element: ElementFinder) {
  expect(element.isPresent()).toBeTruthy();
}

export function expectUrlToContain(url: string) {
  expect(browser.getCurrentUrl()).toContain(url);
}

export function expectUrlToEqual(url: string) {
  expect(browser.getCurrentUrl()).toBe(url);
}

export function doLogin(authPage: AuthPage, email: string, password: string) {
  authPage.getEmailInput().sendKeys(email);
  authPage.getPasswordInput().sendKeys(password);
  authPage.getLoginButton().click();
}

export function waitForPresenceOfLoginFields(authPage: AuthPage) {
  browser.wait(protractor.ExpectedConditions.presenceOf(authPage.getAlternativeLink()), 2000)
    .then(() => {
      authPage.getAlternativeLink().click();
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
