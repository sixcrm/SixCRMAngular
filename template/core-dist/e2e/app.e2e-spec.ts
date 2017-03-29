import { AuthPage } from './po/auth.po';
import {expectPresent} from './utils';

describe('App load', function() {
  let authPage: AuthPage;

  beforeEach(() => {
    authPage = new AuthPage();
  });

  it('should load Auth component', () => {
    authPage.navigateTo();

    expectPresent(authPage.getAuthComponent());
  });

  it('should load Auth0 Lock', () => {
    authPage.navigateTo();

    expectPresent(authPage.getAuth0Lock());
  });
});
