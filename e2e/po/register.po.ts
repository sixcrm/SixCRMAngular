import {browser, by, element} from 'protractor';

export class RegisterPage {

  navigateTo() {
    browser.get('/register');
  }

  getWelcomeScreen() {
    return element(by.css('.registration--in__welcome'));
  }

  getWelcomeContinueButton() {
    return element(by.css('button'));
  }

  getTabLabels() {
    return element.all(by.css('.md-tab-label'));
  }

  getInputs() {
    return element.all(by.css('input'));
  }

  getErrorHints() {
    return element.all(by.css('md-hint'));
  }

  getNextButton() {
    return element(by.css('.tab__buttons')).all(by.css('button')).last();
  }

  getPreviousButton() {
    return element(by.css('.tab__buttons')).all(by.css('span')).first();
  }

  getDropdownTriggers() {
    return element.all(by.css('.tab__content__dropdown'));
  }

  getDropdownItems() {
    return element(by.css('.md-menu-content')).all(by.css('button'));
  }

  getTermsTitle() {
    return element(by.css('.terms__title'));
  }

  getThankYouMessage() {
    return element(by.css('.thank-you__title'));
  }
}
