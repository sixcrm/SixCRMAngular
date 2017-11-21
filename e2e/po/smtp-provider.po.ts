import {element, by} from 'protractor';

export class SmtpProviderPage {

  getCopyIcon() {
    return element(by.css('.smtp-validation__container--results')).element(by.css('md-icon'));
  }

  getEmailInput() {
    return element(by.css('.smtp-validation__container')).element(by.css('input'));
  }

  getInputValidationErrorMessage() {
    return element(by.css('.input-error-message'));
  }

}
