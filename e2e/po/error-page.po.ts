import {browser, element, by} from 'protractor';

export class ErrorPage {

  navigateTo() {
    browser.get('/404');
  }

  getTitle() {
    return element(by.css('.error-page__header__title'));
  }
}
