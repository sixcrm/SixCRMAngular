import {browser, by, element} from 'protractor';

export class RegisterPage {

  navigateTo() {
    browser.get('/register');
  }

  getRegisterContainer() {
    return element(by.css('.registration-form__container'));
  }

  getWelcomeScreen() {
    return element(by.css('.registration-form__title'));
  }

  getWelcomeContinueButton() {
    return element(by.css('.registration-form__button'));
  }

  getInputs() {
    return element(by.css('.registration-form__form')).all(by.css('input'));
  }

  getInvalidInputs() {
    return element.all(by.css('input.ng-invalid'));
  }

  getContinueButton() {
    return element(by.css('.registration-form__button'));
  }

  getSuccessTitle() {
    return element(by.css('.registration-form__title__main--secondary'));
  }
}
