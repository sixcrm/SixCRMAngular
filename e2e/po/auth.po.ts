import { browser, element, by } from 'protractor';

export class AuthPage {
  navigateTo() {
    return browser.get('/');
  }

  getAuthComponent() {
    return element(by.css('auth'));
  }

  getAuth0Lock() {
    return element(by.css('.auth0-lock-widget-container'));
  }

  getAlternativeLink() {
    return element(by.css('.auth0-lock-alternative-link'));
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
