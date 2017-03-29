import {AuthPage} from './po/auth.po';
import {RegisterPage} from './po/register.po';
import {browser} from 'protractor';
import {waitForPresenceOfLoginFields, doLogin, waitForUrlContains, expectUrlToContain} from './utils';

describe('Register', function() {
  let authPage: AuthPage;
  let registerPage: RegisterPage;

  beforeEach(() => {
    authPage = new AuthPage();
    registerPage = new RegisterPage();
    browser.waitForAngularEnabled(true);
  });

  it('should redirect to /register and show welcome when non activated user logs in', () => {
    authPage.navigateTo();

    waitForPresenceOfLoginFields(authPage);

    browser.sleep(2000);
    browser.waitForAngularEnabled(false);

    doLogin(authPage, 'nikolabosic91@gmail.com', '123456789');

    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
    waitForUrlContains('register');

    expectUrlToContain('/register');
  });
});
