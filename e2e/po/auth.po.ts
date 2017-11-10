import { browser, element, by } from 'protractor';

export class AuthPage {
  navigateTo() {
    return browser.get('/');
  }

  getSignupButton() {
    return element(by.css('.auth0-lock-tabs')).all(by.css('li')).last().element(by.css('a'));
  }

  getAuthComponent() {
    return element(by.css('auth'));
  }

  getAuth0Lock() {
    return element(by.css('.auth0-lock-widget-container'));
  }

  getAlternativeLink() {
    return element(by.linkText('Not your account?'));
  }

  getRegistrationLink() {
    return element(by.linkText('Sign Up'));
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
