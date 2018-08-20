import { AuthPage } from '../po/auth.po';
import {expectPresent, expectNotPresent} from '../utils/assertation.utils';
import {clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {browser} from 'protractor';

describe('App load', function() {
  let authPage: AuthPage;

  beforeEach(() => {
    authPage = new AuthPage();
    browser.waitForAngularEnabled(false);
  });

  afterEach(() => {
    browser.waitForAngularEnabled(true);
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should load Auth component', () => {
    authPage.navigateTo();

    expectPresent(authPage.getAuthComponent());
  });

  it('should fail', () => {
    authPage.navigateTo();

    expectNotPresent(authPage.getAuthComponent());
  });
});
