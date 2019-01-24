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

  getPaymentButtons() {
    return element(by.css('.container')).all(by.css('button'));
  }

  getPaymentEntryCardDates() {
    return element(by.css('.mat-autocomplete-panel')).all(by.css('mat-option'));
  }

  getPaymentSetupButtonText() {
    return element(by.css('.payment')).element(by.css('span'));
  }

  getPaymentSetupButton() {
    return element(by.css('.payment'));
  }

  getInputs() {
    return element(by.css('.advanced-payment-body')).all(by.css('input'));
  }

  getBillingNextButton() {
    return element(by.css('.buttons')).all(by.css('button')).last();
  }

  getConfirmationScreen() {
    return element(by.css('plan-confirmation'));
  }

  getCardConfirmName() {
    return element(by.css('.card-info__details')).all(by.css('div')).first();
  }

  getConfirmAddressDetails() {
    return element(by.css('.billing-info')).all(by.css('div'));
  }

  getCompleteButton() {
    return this.getConfirmationScreen().element(by.css('button'));
  }

  getErrorMessage() {
    return element(by.css('.error-message'));
  }

  getLogoutButton() {
    return element(by.css('button'));
  }
}
