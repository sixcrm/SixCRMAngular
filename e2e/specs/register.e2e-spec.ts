import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {browser} from 'protractor';
import {waitForPresenceOfLoginFields, waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {doSignUp} from '../utils/action.utils';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {TopnavPage} from '../po/topnav.po';
import {TermsAndConditionsPage} from '../po/terms-and-conditions.po';

let registrationUsername = `tr${new Date().getTime()}@example.com`;
let registrationPassword = 'testingregistrationpassword';

describe('Register', function() {
  let authPage: AuthPage;
  let registerPage: RegisterPage;
  let appTopNav: TopnavPage;
  let termsAndConditionsPage: TermsAndConditionsPage;

  beforeEach(() => {
    authPage = new AuthPage();
    registerPage = new RegisterPage();
    appTopNav = new TopnavPage();
    termsAndConditionsPage = new TermsAndConditionsPage();
  });

  afterAll(() => {
    browser.waitForAngularEnabled(true);

    clearLocalStorage();
  });

  beforeAll(() => {
    browser.waitForAngularEnabled(false);
    browser.get('/');
    clearLocalStorage();
  });

  it('should redirect to /terms-and-conditions', () => {
    authPage.navigateTo();

    waitForPresenceOfLoginFields(authPage);

    doSignUp(authPage, registrationUsername, registrationPassword);

    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
    waitForUrlContains('terms-and-conditions');

    expectUrlToContain('/terms-and-conditions');
    expectPresent(termsAndConditionsPage.getContainer());
  });

  it('should redirect to /dashboard when accept user and owner terms and conditions', () => {
    browser.sleep(2000);
    termsAndConditionsPage.getAcceptButton().click();
    browser.sleep(2000);
    termsAndConditionsPage.getAcceptButton().click();

    waitForUrlContains('dashboard');

    expectUrlToContain('/dashboard');
    expectPresent(registerPage.getWelcomeScreen());
    expectPresent(registerPage.getWelcomeContinueButton());
  });

  it('should render sign up form on registration field', () => {
    expect(registerPage.getInputs().count()).toEqual(3);
  });

  it('should show errors if inputs of sign up form are invalid', () => {
    registerPage.getContinueButton().click();

    expect(registerPage.getInvalidInputs().count()).toEqual(3);
  });

  it('should remove errors if inputs of sign up form get corrected', () => {
    registerPage.getInputs().get(0).sendKeys('test company');
    registerPage.getInputs().get(1).sendKeys('test name');
    registerPage.getInputs().get(2).sendKeys('test lastname');

    expect(registerPage.getInvalidInputs().count()).toEqual(0);
  });

  it('should render registration success', () => {
    registerPage.getContinueButton().click();
    browser.sleep(3000);

    expect(registerPage.getSuccessTitle().getText()).toContain('Your account is now active and you may begin exploring at your leisure.')
  });
});
