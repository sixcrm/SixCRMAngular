import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {browser} from 'protractor';
import {
  waitForPresenceOfLoginFields, waitForUrlContains, clearLocalStorage,
  clearAuth0SSO
} from '../utils/navigation.utils';
import {doSignUp} from '../utils/action.utils';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {TopnavPage} from '../po/topnav.po';
import {TermsAndConditionsPage} from '../po/terms-and-conditions.po';
import {NavPage} from '../po/nav.po';

let registrationUsername = `tr${new Date().getTime()}@example.com`;
let registrationPassword = 'testingregistrationpassword';
let newCompany = `e2e_Company_${new Date().getTime()}`;

describe('Register', function() {
  let authPage: AuthPage;
  let registerPage: RegisterPage;
  let appTopNav: TopnavPage;
  let termsAndConditionsPage: TermsAndConditionsPage;
  let acceptInvitePage: AcceptInvitePage;
  let nav: NavPage;

  beforeEach(() => {
    authPage = new AuthPage();
    registerPage = new RegisterPage();
    appTopNav = new TopnavPage();
    termsAndConditionsPage = new TermsAndConditionsPage();
    acceptInvitePage = new AcceptInvitePage();
    nav = new NavPage();
  });

  afterAll(() => {
    browser.waitForAngularEnabled(true);

    clearLocalStorage();
    clearAuth0SSO();
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
    registerPage.getInputs().get(1).sendKeys(123);
    registerPage.getInputs().get(2).sendKeys('Card Name');
    registerPage.getInputs().get(3).click();
    browser.sleep(200);
    registerPage.getPaymentEntryCardDates().get(6).click();
    registerPage.getInputs().get(4).click();
    browser.sleep(200);
    registerPage.getPaymentEntryCardDates().get(4).click();

    registerPage.getInputs().get(5).sendKeys('1 test');
    registerPage.getInputs().get(6).sendKeys('test line');
    registerPage.getInputs().get(7).sendKeys('New York');
    registerPage.getInputs().get(8).sendKeys('Oregon');
    registerPage.getInputs().get(9).sendKeys('21000');
    registerPage.getInputs().get(10).sendKeys('United States');
  });

  it('should continue to confirmation screen', () => {
    registerPage.getBillingNextButton().click();

    expectPresent(registerPage.getConfirmationScreen());

    expect(registerPage.getCompleteButton().getText()).toContain('$150');
    expect(registerPage.getCardConfirmName().getText()).toContain('Card Name');

    expect(registerPage.getConfirmAddressDetails().get(1).getText()).toContain('1 test');
    expect(registerPage.getConfirmAddressDetails().get(2).getText()).toContain('New York, Oregon 21000');
    expect(registerPage.getConfirmAddressDetails().get(3).getText()).toContain('United States');
  });

  it('should successfully finish registration', () => {
    browser.sleep(2000);

    registerPage.getCompleteButton().click();
    waitForUrlContains('/dashboard?w=true', 20000);
    expectUrlToContain('/dashboard?w=true');
  });

  it('should render full nav menu', () => {
    browser.sleep(3000);

    nav.getNavToggler().click();
    expect(nav.getItems().count()).toBe(27);
  });

  it('should navigate to billing page', () => {
    nav.getLink(21).click();

    waitForUrlContains('accountmanagement/billing');
    expectUrlToContain('accountmanagement/billing');
  });
});
