import {browser, element, by} from 'protractor';

export class AcceptInvitePage {

  navigateTo(path: string) {
    browser.get(path);
  }

  getAcceptInviteDialog() {
    return element(by.css('.accept-invite__form'))
  }

  getTitle() {
    return element(by.css('.title'));
  }

  getLoginButton() {
    return element(by.css('.accept-invite__button'))
  }

  getCancelButton() {
    return element(by.css('.registration-form__button--cancel'))
  }

  getWelcomeText() {
    return element(by.css('.title'));
  }

  getWelcomeInstructions() {
    return element(by.css('.subtitle'));
  }

  getAcceptButton() {
    return element(by.css('.accept-invite__button--small-margin'));
  }

  getContinueButton() {
    return element(by.css('.accept-invite__button--standalone'));
  }

  getInputs() {
    return element.all(by.css('input'));
  }

  getErrorHints() {
    return element.all(by.css('md-hint'));
  }

  getRegistrationCompleteMessage() {
    return element(by.css('.invite-accept__in__content__notification__primary'));
  }

  getRegistrationCompleteInstructions() {
    return element(by.css('.invite-accept__in__content__notification__secondary'));
  }
}
