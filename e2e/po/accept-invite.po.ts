import {browser, element, by} from 'protractor';

export class AcceptInvitePage {

  navigateTo(path: string) {
    browser.get(path);
  }

  getAcceptInviteDialog() {
    return element(by.css('.invite-accept__in'))
  }

  getInviteeEmail() {
    return element(by.css('.invite-accept__in__content__notification__primary--bold'));
  }

  getLoginButton() {
    return element(by.css('.invite-accept__in__content__button')).all(by.css('button')).first();
  }

  getCancelButton() {
    return element(by.css('.invite-accept__in__content__button')).all(by.css('button')).last();
  }

  getWelcomeText() {
    return element(by.css('.invite-accept__in__content__notification__primary'));
  }

  getWelcomeInstructions() {
    return element(by.css('.invite-accept__in__content__notification__secondary'));
  }

  getAcceptButton() {
    return element(by.css('button'));
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
