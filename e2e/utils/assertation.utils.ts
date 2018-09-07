import {browser, ElementFinder} from 'protractor';

export function expectPresent(element: ElementFinder) {
  expect(element.isPresent()).toBeTruthy();
}

export function expectNotPresent(element: ElementFinder) {
  expect(element.isPresent()).toBeFalsy();
}

export function expectDefined(element: ElementFinder) {
  expect(element).toBeDefined(false);
}

export function expectUndefined(element: ElementFinder) {
  expect(element).toBeDefined(true);
}

export function expectUrlToContain(url: string) {
  expect(browser.getCurrentUrl()).toContain(url);
}

export function expectUrlToEqual(url: string) {
  expect(browser.getCurrentUrl()).toBe(url);
}
