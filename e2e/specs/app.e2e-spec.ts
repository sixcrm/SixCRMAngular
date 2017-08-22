import { AuthPage } from '../po/auth.po';
import {expectPresent} from '../utils/assertation.utils';
import {clearLocalStorage} from '../utils/navigation.utils';

describe('App load', function() {
  let authPage: AuthPage;

  beforeEach(() => {
    authPage = new AuthPage();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  it('should load Auth component', () => {
    authPage.navigateTo();

    expectPresent(authPage.getAuthComponent());
  });
});
