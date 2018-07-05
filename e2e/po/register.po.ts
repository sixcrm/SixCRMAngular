import {browser, by, element} from 'protractor';

export class RegisterPage {

  navigateTo() {
    browser.get('/register');
  }

  getRegisterContainer() {
    return element(by.css('.registration-form__container'));
  }

  getDeclineError() {
    return element(by.css('.error-row-above'));
  }

  getPaymentView() {
    return element(by.css('.plan'));
  }

  getPaymentOptions() {
    return element(by.css('.container')).all(by.css('.name'));
  }

  getPaymentPlan() {
    return element(by.css('.container')).all(by.css('.plan'));
  }

  getPaymentButtons() {
    return element(by.css('.container')).all(by.css('button'));
  }

  getPaymentEntryTitle() {
    return element(by.css('.registration-column-right')).element(by.css('.title'));
  }

  getPaymentEntryCardDate() {
    return element(by.css('.dates')).all(by.css('.element'));
  }

  getPaymentEntryCardMonth() {
    return element(by.css('.mat-menu-content')).all(by.css('button'));
  }

  getPaymentContinueButton() {
    return element(by.css('.registration-column-right')).element(by.css('button'));
  }

  getPaymentDeclineButton() {
    return element(by.css('.column.right')).element(by.css('button'));
  }

  getPaymentSetupButtonText() {
    return element(by.css('.payment')).element(by.css('span'));
  }

  getPaymentSetupButton() {
    return element(by.css('.payment'));
  }

  getWelcomeScreen() {
    return element(by.css('.registration-form__title'));
  }

  getWelcomeContinueButton() {
    return element(by.css('.registration-form__button'));
  }

  getInputs() {
    return element(by.css('.content')).all(by.css('input'));
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

  getBillingNextButton() {
    return element(by.css('.buttons')).all(by.css('button')).last();
  }

  getConfirmationScreen() {
    return element(by.css('plan-payment'));
  }

  getCompleteButton() {
    return this.getConfirmationScreen().element(by.css('button'));
  }
}
