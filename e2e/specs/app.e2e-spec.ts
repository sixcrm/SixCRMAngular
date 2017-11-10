import { AuthPage } from '../po/auth.po';
import {expectPresent} from '../utils/assertation.utils';
import {clearLocalStorage} from '../utils/navigation.utils';
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
  });

  it('should load Auth component', () => {
    authPage.navigateTo();

    expectPresent(authPage.getAuthComponent());
  });
});
