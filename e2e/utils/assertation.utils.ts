import {browser, ElementFinder} from 'protractor';

export function expectPresent(element: ElementFinder) {
  expect(element.isPresent()).toBeTruthy();
}

export function expectUrlToContain(url: string) {
  expect(browser.getCurrentUrl()).toContain(url);
}

export function expectUrlToEqual(url: string) {
  expect(browser.getCurrentUrl()).toBe(url);
}
