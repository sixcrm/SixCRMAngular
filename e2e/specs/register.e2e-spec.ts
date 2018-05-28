import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {browser} from 'protractor';
import {waitForPresenceOfLoginFields, waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {doSignUp} from '../utils/action.utils';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {TopnavPage} from '../po/topnav.po';
import {TermsAndConditionsPage} from '../po/terms-and-conditions.po';

let registrationUsername = `tr${new Date().getTime()}@example.com`;
let registrationPassword = 'testingregistrationpassword';
let newCompany = `e2e_Company_${new Date().getTime()}`;

describe('Register', function() {
  let authPage: AuthPage;
  let registerPage: RegisterPage;
  let appTopNav: TopnavPage;
  let termsAndConditionsPage: TermsAndConditionsPage;
  let acceptInvitePage: AcceptInvitePage;

  beforeEach(() => {
    authPage = new AuthPage();
    registerPage = new RegisterPage();
    appTopNav = new TopnavPage();
    termsAndConditionsPage = new TermsAndConditionsPage();
    acceptInvitePage = new AcceptInvitePage();
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

  it('should redirect to base registration page', () => {
    authPage.navigateTo();
    waitForPresenceOfLoginFields(authPage);

    doSignUp(authPage, registrationUsername, registrationPassword);

    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
    waitForUrlContains('/register');
    expectUrlToContain('/register');
  });

  it('should redirect to /payment and show payment views when register info is filled out', () => {
    browser.sleep(2000);
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getRegisterInputs(0).sendKeys('e2e First');
    acceptInvitePage.getRegisterInputs(1).sendKeys('e2e Last');
    acceptInvitePage.getRegisterInputs(2).sendKeys(newCompany);
    acceptInvitePage.getRegisterAcceptButton().click();
    browser.sleep(2000);
    waitForUrlContains('/payment');
    expectUrlToContain('/payment');
    expectPresent(registerPage.getPaymentView());
    expect(registerPage.getPaymentOptions().get(0).getText()).toEqual('Basic');
    expect(registerPage.getPaymentOptions().get(1).getText()).toEqual('Professional');
    expect(registerPage.getPaymentOptions().get(2).getText()).toEqual('Premium');
  });

  it ('should choose Professional Plan and move to payment entry', () => {
    browser.waitForAngularEnabled(false);
    registerPage.getPaymentButtons().get(1).click();
    browser.sleep(1500);
    expect(registerPage.getPaymentEntryTitle().getText()).toEqual('You have chosen the SIX Professional Tier');
    browser.sleep(1500);
  });

  it ('should enter CC info and then SUCCESS', () => {
    browser.waitForAngularEnabled(false);
    // card number
    registerPage.getInputs().get(0).sendKeys(4242424242424242);
    // security code
    registerPage.getInputs().get(1).sendKeys(123);
    // name on card
    registerPage.getInputs().get(2).sendKeys('Card Name');
    // choose month
    registerPage.getPaymentEntryCardDate().first().click();
    browser.sleep(200);
    registerPage.getPaymentEntryCardMonth().get(6).click();
    // choose year
    registerPage.getPaymentEntryCardDate().last().click();
    browser.sleep(200);
    registerPage.getPaymentEntryCardMonth().get(4).click();
    // Finish Registration
    registerPage.getPaymentContinueButton().click();
    browser.sleep(14000);
    waitForUrlContains('/dashboard?w=true');
    browser.sleep(5000);
    expectUrlToContain('/dashboard?w=true');
  });

});
