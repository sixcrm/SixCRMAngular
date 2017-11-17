import {browser, element, by} from 'protractor';

export class TermsAndConditionsPage {

  navigateTo() {
    browser.get('/terms-and-conditions');
  }

  getAcceptButton() {
    return element(by.css('.terms-and-conditions__button'));
  }

  getContainer() {
    return element(by.css('.terms-and-conditions__container'));
  }
}
