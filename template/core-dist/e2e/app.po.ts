import { browser, element, by } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getAuthComponent() {
    return element(by.css('auth'));
  }

  getAuth0Lock() {
    return element(by.css('.auth0-lock-widget-container'));
  }

  getEmailInput() {
    return element(by.name('email'));
  }

  getPasswordInput() {
    return element(by.name('password'));
  }

  getLoginButton() {
    return element(by.css('.auth0-lock-submit'));
  }

  getErrorMessage() {
    return element(by.css('.auth0-global-message-error'));
  }
}
