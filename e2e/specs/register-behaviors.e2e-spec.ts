import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {browser} from 'protractor';
import {
  waitForPresenceOfLoginFields, waitForUrlContains, clearLocalStorage,
  waitForPresenceOf
} from '../utils/navigation.utils';
import {doSignUp, doLogin} from '../utils/action.utils';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {TopnavPage} from '../po/topnav.po';
import {TermsAndConditionsPage} from '../po/terms-and-conditions.po';

let registrationUsername = `tr${new Date().getTime()}@example.com`;
let registrationPassword = 'testingregistrationpassword';
let newCompany = `e2e_Company_${new Date().getTime()}`;

describe('Register with behaviors', function() {
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
    browser.restart();
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
    registerPage.getPaymentButtons().get(1).click();
  });

  it ('should refresh the page and navigate to account info screen', () => {
    browser.sleep(2000);
    browser.refresh();
    waitForUrlContains('account-info');
    expectUrlToContain('account-info');
    expect(registerPage.getPaymentSetupButtonText().getText()).toEqual('SETUP PAYMENT PLAN');
  });

  it ('should click the setup button and move to the payment screen', () => {
    registerPage.getPaymentSetupButton().click();
    waitForUrlContains('/payment');
    expectUrlToContain('/payment');
  });

  it ('should choose Professional Plan and move to payment entry', () => {
    registerPage.getPaymentButtons().get(1).click();
  });

  it ('should hit back button and navigate to account info screen', () => {
    browser.sleep(2000);
    browser.navigate().back();
    waitForUrlContains('account-info');
    expectUrlToContain('account-info');
    expect(registerPage.getPaymentSetupButtonText().getText()).toEqual('SETUP PAYMENT PLAN');
  });

  it ('should click the setup button and move to the payment screen', () => {
    registerPage.getPaymentSetupButton().click();
    waitForUrlContains('/payment');
    expectUrlToContain('/payment');
  });

  it ('should log out, log back in and display account info screen', () => {
    registerPage.getLogoutButton().click();

    waitForPresenceOfLoginFields(authPage);

    doLogin(authPage, registrationUsername, registrationPassword);

    waitForUrlContains('account-info');
    expectUrlToContain('account-info');
    expect(registerPage.getPaymentSetupButtonText().getText()).toEqual('SETUP PAYMENT PLAN');
  });

  it ('should click the setup button and move to the payment screen', () => {
    registerPage.getPaymentSetupButton().click();
    waitForUrlContains('/payment');
    expectUrlToContain('/payment');
  });

  it ('should choose Professional Plan and move to payment entry', () => {
    registerPage.getPaymentButtons().get(1).click();
  });

  it ('should enter CC info', () => {
    browser.sleep(2000);
    registerPage.getInputs().get(0).sendKeys(4242424242424241);
    registerPage.getInputs().get(1).sendKeys('Card Name');
    registerPage.getInputs().get(2).sendKeys(123);
    registerPage.getPaymentEntryCardDate().first().click();
    browser.sleep(200);
    registerPage.getPaymentEntryCardMonth().get(6).click();
    registerPage.getPaymentEntryCardDate().last().click();
    browser.sleep(200);
    registerPage.getPaymentEntryCardMonth().get(4).click();

    registerPage.getInputs().get(3).sendKeys('1 test');
    registerPage.getInputs().get(4).sendKeys('test line');
    registerPage.getInputs().get(5).sendKeys('New York');
    registerPage.getInputs().get(6).sendKeys('21000');
    registerPage.getInputs().get(7).sendKeys('Oregon');
    registerPage.getInputs().get(8).sendKeys('United States');
  });

  it('should continue to confirmation screen', () => {
    registerPage.getBillingNextButton().click();

    expectPresent(registerPage.getConfirmationScreen())
  });

  it('should render error due to bad credit card number', () => {
    browser.sleep(2000);

    registerPage.getCompleteButton().click();
    waitForPresenceOf(registerPage.getErrorMessage());
    expect(registerPage.getErrorMessage().getText()).toBeDefined();
  })

});
