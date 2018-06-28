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

  getRegisterAcceptButton() {
    return element(by.css('.actions')).element(by.css('button'));
  }

  getInputs() {
    return element.all(by.css('input'));
  }

  getAuth0SubmitButton() {
    return element(by.css('.auth0-lock-submit'));
  }

  getRegisterTitle() {
    return element(by.css('.subtitle'));
  }

  getRegisterInputs(num) {
    return element.all(by.css('input')).get(num);
  }

  getRegisterTerms() {
    return element(by.css('.terms'));
  }

}
