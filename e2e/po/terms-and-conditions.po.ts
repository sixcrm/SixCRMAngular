import {browser, element, by} from 'protractor';

export class TermsAndConditionsPage {

  navigateTo() {
    browser.get('/terms-and-conditions');
  }

  getAcceptButton() {
    return element(by.css('.registration-form__button'));
  }

  getModal() {
    return element(by.css('.terms-and-conditions__container'));
  }
}
