import {browser, by, element} from 'protractor';

export class RegisterPage {

  navigateTo() {
    browser.get('/register');
  }

  getWelcomeScreen() {
    return element(by.css('.registration-form__title'));
  }

  getWelcomeContinueButton() {
    return element(by.css('.registration-form__button'));
  }

  getInputs() {
    return element.all(by.css('input'));
  }

  getInvalidInputs() {
    return element.all(by.css('input .ng-invalid'));
  }

  getContinueButton() {
    return element(by.css('.registration-form__button'));
  }
}
