import {browser, element, by} from 'protractor';

export class AcceptInvitePage {

  navigateTo(path: string) {
    browser.get(path);
  }

  getAcceptInviteDialog() {
    return element(by.css('.accept-invite__form'))
  }

  getAcceptButton() {
    return element(by.css('button'));
  }

  getAuth0Modal() {
    return element(by.css('.auth0-lock-widget'));
  }

  getAuth0SignUpTab() {
    return element(by.css('.auth0-lock-tabs')).all(by.css('li'));
  }

  getContinueButton() {
    return element(by.css('.accept-invite__button--standalone'));
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



  getWelcomeInstructions() {
    return element(by.css('.subtitle'));
  }



  getInputs() {
    return element.all(by.css('input'));
  }

  getAclSwitchGraphics() {
    return element(by.css('.instructions'));
  }

  getErrorHints() {
    return element.all(by.css('mat-hint'));
  }

  getRegistrationCompleteMessage() {
    return element(by.css('.invite-accept__in__content__notification__primary'));
  }

  getRegistrationCompleteInstructions() {
    return element(by.css('.invite-accept__in__content__notification__secondary'));
  }
}
