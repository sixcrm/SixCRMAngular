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

  it ('should choose Professional Plan and move to billing entry', () => {
    browser.waitForAngularEnabled(false);
    registerPage.getPaymentButtons().get(1).click();
    browser.sleep(2000);
  });

  it ('should enter CC info', () => {
    browser.sleep(2000);
    registerPage.getInputs().get(0).sendKeys(4242424242424242);
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

    expect(registerPage.getCompleteButton().getText()).toContain('$150');
    expect(registerPage.getConfirmCardDetails().get(0).getText()).toContain('4242');
    expect(registerPage.getConfirmCardDetails().get(1).getText()).toContain('Card Name');
    expect(registerPage.getConfirmCardDetails().get(2).getText()).toContain('07/2022');

    expect(registerPage.getConfirmAddressDetails().get(0).getText()).toContain('1 test');
    expect(registerPage.getConfirmAddressDetails().get(1).getText()).toContain('test line');
    expect(registerPage.getConfirmAddressDetails().get(2).getText()).toContain('Oregon');
    expect(registerPage.getConfirmAddressDetails().get(2).getText()).toContain('21000');
    expect(registerPage.getConfirmAddressDetails().get(3).getText()).toContain('United States');

    expectPresent(registerPage.getConfirmationScreen())
  });

  it('should successfully finish registration', () => {
    browser.sleep(2000);

    registerPage.getCompleteButton().click();
    waitForUrlContains('/dashboard?w=true', 20000);
    expectUrlToContain('/dashboard?w=true');
  })

});
