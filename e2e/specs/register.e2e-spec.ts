import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {browser} from 'protractor';
import {
  waitForPresenceOfLoginFields, waitForUrlContains,
  navigateRegisteruserToRegistration, waitForPresenceOf
} from '../utils/navigation.utils';
import {doLogin} from '../utils/action.utils';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {createTestAuth0JWT} from '../utils/jwt.utils';
import {deleteMutation} from '../utils/graph.utils';

var supertest = require('supertest');

let username = 'regUsername';
let firstName = 'regFirstname';
let lastName = 'regLastname';
let company = 'regCompany';
let adr1 = 'adr1';
let adr2 = 'adr2';
let country = 'USA';
let state = 'Alabama';
let city = 'Alab';
let zip = '21000';
let ccNumber = '123123123123321';
let ccv = '4321';
let month = '12';
let year = '2027';

describe('Register', function() {
  let authPage: AuthPage;
  let registerPage: RegisterPage;

  let registrationUsername = 'testingregistration@example.com';
  let registrationPassword = 'testingregistrationpassword';

  beforeEach(() => {
    authPage = new AuthPage();
    registerPage = new RegisterPage();
    browser.waitForAngularEnabled(true);
  });

  afterAll((done) => {
    let jwt = createTestAuth0JWT('super.user@test.com');
    let request = supertest('https://api.sixcrm.com/');

    request.post('graph/*')
      .set('Authorization', jwt)
      .send(deleteMutation(registrationUsername))
      .end(() => done());
  });

  it('should redirect to /register and show welcome when non existing user logs in', () => {
    authPage.navigateTo();

    waitForPresenceOfLoginFields(authPage);
    browser.waitForAngularEnabled(false);

    doLogin(authPage, registrationUsername, registrationPassword);

    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
    waitForUrlContains('register');

    expectUrlToContain('/register');
    expectPresent(registerPage.getWelcomeScreen());
    expectPresent(registerPage.getWelcomeContinueButton());
  });

  it('should render sign up form on registration field', () => {
    navigateRegisteruserToRegistration();

    registerPage.getWelcomeContinueButton().click();

    expect(registerPage.getTabLabels().count()).toEqual(4);
    expect(registerPage.getInputs().count()).toEqual(4);
    expect(registerPage.getNextButton().isEnabled()).toBe(false);
  });

  it('should show errors if inputs of sign up form are invalid', () => {
    navigateRegisteruserToRegistration();

    registerPage.getWelcomeContinueButton().click();
    registerPage.getInputs().get(0).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toBe(false);

    registerPage.getInputs().get(1).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toBe(false);

    registerPage.getInputs().get(2).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toBe(false);

    registerPage.getInputs().get(3).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toBe(true);

    registerPage.getNextButton().click();

    expect(registerPage.getErrorHints().count()).toEqual(4);
    expect(registerPage.getErrorHints().get(0).getText()).toEqual('more than four characters please!');
    expect(registerPage.getErrorHints().get(1).getText()).toEqual('more than two characters please!');
    expect(registerPage.getErrorHints().get(2).getText()).toEqual('more than two characters please!');
    expect(registerPage.getErrorHints().get(3).getText()).toEqual('more than four characters please!');
  });

  it('should remove errors if inputs of sign up form get corrected', () => {
    navigateRegisteruserToRegistration();

    registerPage.getWelcomeContinueButton().click();
    registerPage.getInputs().get(0).sendKeys('a');
    registerPage.getInputs().get(1).sendKeys('a');
    registerPage.getInputs().get(2).sendKeys('a');
    registerPage.getInputs().get(3).sendKeys('a');

    clickNextButton(registerPage);

    addSignupFormData(registerPage);

    registerPage.getNextButton().click();

    expect(registerPage.getErrorHints().count()).toEqual(0);
  });

  it('should navigate to address form when sign up details are valid', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    expect(registerPage.getInputs().count()).toEqual(4);
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);
  });

  it('should show errors if inputs of address form are invalid', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    registerPage.getInputs().get(0).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getInputs().get(1).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getInputs().get(2).sendKeys('a');
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getInputs().get(3).sendKeys('1');
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getDropdownTriggers().last().click();
    browser.sleep(500);
    registerPage.getDropdownItems().first().click();

    expect(registerPage.getNextButton().isEnabled()).toEqual(true);
    clickNextButton(registerPage);

    expect(registerPage.getErrorHints().count()).toEqual(3);
    expect(registerPage.getErrorHints().get(0).getText()).toEqual('more than four characters please!');
    expect(registerPage.getErrorHints().get(1).getText()).toEqual('more than two characters please!');
    expect(registerPage.getErrorHints().get(2).getText()).toEqual('five characters please!');
  });

  it('should remove errors if inputs of address form get corrected', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    registerPage.getInputs().get(0).sendKeys('a');
    registerPage.getInputs().get(1).sendKeys('a');
    registerPage.getInputs().get(2).sendKeys('a');
    registerPage.getInputs().get(3).sendKeys('1');
    registerPage.getDropdownTriggers().last().click();
    browser.sleep(500);
    registerPage.getDropdownItems().first().click();

    clickNextButton(registerPage);

    registerPage.getInputs().get(0).sendKeys(adr1);
    registerPage.getInputs().get(1).sendKeys(adr2);
    registerPage.getInputs().get(2).sendKeys(city);
    registerPage.getInputs().get(3).sendKeys(zip);

    browser.sleep(600);
    expect(registerPage.getErrorHints().count()).toEqual(0);
  });

  it('should navigate to payment form when address form details are valid', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    expect(registerPage.getInputs().count()).toEqual(2);
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);
  });

  it('should show errors if inputs of payment form are invalid', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    registerPage.getInputs().get(0).sendKeys('1');
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getInputs().get(1).sendKeys('1');
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getDropdownTriggers().first().click();
    browser.sleep(500);
    registerPage.getDropdownItems().last().click();
    expect(registerPage.getNextButton().isEnabled()).toEqual(false);

    registerPage.getDropdownTriggers().last().click();
    browser.sleep(500);
    registerPage.getDropdownItems().last().click();

    clickNextButton(registerPage);

    expect(registerPage.getErrorHints().count()).toEqual(1);
    expect(registerPage.getErrorHints().get(0).getText()).toEqual('more then three characters please!');
  });

  it('should remove errors if inputs of payment form get corrected', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    registerPage.getInputs().get(0).sendKeys('1');
    registerPage.getInputs().get(1).sendKeys('1');
    registerPage.getDropdownTriggers().first().click();
    browser.sleep(500);
    registerPage.getDropdownItems().last().click();
    registerPage.getDropdownTriggers().last().click();
    browser.sleep(500);
    registerPage.getDropdownItems().last().click();

    clickNextButton(registerPage);

    registerPage.getInputs().get(0).sendKeys(ccNumber);
    registerPage.getInputs().get(1).sendKeys(ccv);

    browser.sleep(500);
    expect(registerPage.getErrorHints().count()).toEqual(0);
    expect(registerPage.getNextButton().isEnabled()).toEqual(true);
  });

  it('should display confirmation details when payment form details are valid', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    addPaymentFormData(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    expect(registerPage.getInputs().count()).toEqual(12);
    expect(registerPage.getInputs().get(0).getAttribute('value')).toEqual(username);
    expect(registerPage.getInputs().get(1).getAttribute('value')).toEqual(firstName);
    expect(registerPage.getInputs().get(2).getAttribute('value')).toEqual(lastName);
    expect(registerPage.getInputs().get(3).getAttribute('value')).toEqual(company);
    expect(registerPage.getInputs().get(4).getAttribute('value')).toEqual(adr1);
    expect(registerPage.getInputs().get(5).getAttribute('value')).toEqual(adr2);
    expect(registerPage.getInputs().get(6).getAttribute('value')).toEqual(country);
    expect(registerPage.getInputs().get(7).getAttribute('value')).toEqual(state);
    expect(registerPage.getInputs().get(8).getAttribute('value')).toEqual(ccNumber.substring(ccNumber.length-4, ccNumber.length));
    expect(registerPage.getInputs().get(9).getAttribute('value')).toEqual(zip);
    expect(registerPage.getInputs().get(10).getAttribute('value')).toEqual(ccv);
    expect(registerPage.getInputs().get(11).getAttribute('value')).toEqual(month + '/' + year);
  });

  it('should be able to go back and modify details', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    addPaymentFormData(registerPage);
    clickNextButton(registerPage);

    clickPreviousButton(registerPage);
    browser.sleep(600);

    let ccv2 = '9876';
    registerPage.getInputs().get(1).clear();
    registerPage.getInputs().get(1).sendKeys(ccv2);

    clickPreviousButton(registerPage);
    browser.sleep(600);

    let zip2 = '12000';
    registerPage.getInputs().get(3).clear();
    registerPage.getInputs().get(3).sendKeys(zip2);

    clickPreviousButton(registerPage);
    browser.sleep(600);

    let company2 = 'company2';
    registerPage.getInputs().get(3).clear();
    registerPage.getInputs().get(3).sendKeys(company2);

    clickNextButton(registerPage);
    clickNextButton(registerPage);
    clickNextButton(registerPage);

    browser.sleep(600);
    expect(registerPage.getInputs().count()).toEqual(12);
    expect(registerPage.getInputs().get(0).getAttribute('value')).toEqual(username);
    expect(registerPage.getInputs().get(1).getAttribute('value')).toEqual(firstName);
    expect(registerPage.getInputs().get(2).getAttribute('value')).toEqual(lastName);
    expect(registerPage.getInputs().get(3).getAttribute('value')).toEqual(company2);
    expect(registerPage.getInputs().get(4).getAttribute('value')).toEqual(adr1);
    expect(registerPage.getInputs().get(5).getAttribute('value')).toEqual(adr2);
    expect(registerPage.getInputs().get(6).getAttribute('value')).toEqual(country);
    expect(registerPage.getInputs().get(7).getAttribute('value')).toEqual(state);
    expect(registerPage.getInputs().get(8).getAttribute('value')).toEqual(ccNumber.substring(ccNumber.length-4, ccNumber.length));
    expect(registerPage.getInputs().get(9).getAttribute('value')).toEqual(zip2);
    expect(registerPage.getInputs().get(10).getAttribute('value')).toEqual(ccv2);
    expect(registerPage.getInputs().get(11).getAttribute('value')).toEqual(month + '/' + year);
  });

  it('should display terms and conditions', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    addPaymentFormData(registerPage);
    clickNextButton(registerPage);

    clickNextButton(registerPage);

    expect(registerPage.getNextButton().isEnabled()).toBe(false);
    expectPresent(registerPage.getTermsTitle());
  });

  it('should display error if \'full name\' on terms and conditions screen does not match', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    addPaymentFormData(registerPage);
    clickNextButton(registerPage);

    clickNextButton(registerPage);

    registerPage.getInputs().first().sendKeys('wrong name');
    clickNextButton(registerPage);

    expect(registerPage.getErrorHints().first().getText()).toEqual(`Full name must match ${firstName} ${lastName}`);
  });

  it('should complete registration if terms and conditions accepted', () => {
    navigateRegisteruserToRegistration();
    registerPage.getWelcomeContinueButton().click();
    addSignupFormData(registerPage);
    clickNextButton(registerPage);

    addAddressFormData(registerPage);
    clickNextButton(registerPage);

    addPaymentFormData(registerPage);
    clickNextButton(registerPage);

    clickNextButton(registerPage);

    browser.sleep(600);
    registerPage.getInputs().first().sendKeys('wrong name');
    clickNextButton(registerPage);

    registerPage.getInputs().clear();
    registerPage.getInputs().first().sendKeys(`${firstName} ${lastName}`);
    clickNextButton(registerPage);

    waitForPresenceOf(registerPage.getThankYouMessage());
    expectPresent(registerPage.getThankYouMessage());
  });

  it('should show thank you screen when user who accepted terms and conditions logs in', () => {
    navigateRegisteruserToRegistration();

    waitForPresenceOf(registerPage.getThankYouMessage());
    expectPresent(registerPage.getThankYouMessage());
  })
});

function addSignupFormData(registerPage: RegisterPage) {
  browser.sleep(600);
  registerPage.getInputs().get(0).sendKeys(username);
  registerPage.getInputs().get(1).sendKeys(firstName);
  registerPage.getInputs().get(2).sendKeys(lastName);
  registerPage.getInputs().get(3).sendKeys(company);
}

function addAddressFormData(registerPage: RegisterPage) {
  browser.sleep(600);
  registerPage.getInputs().get(0).sendKeys(adr1);
  registerPage.getInputs().get(1).sendKeys(adr2);
  registerPage.getInputs().get(2).sendKeys(city);
  registerPage.getDropdownTriggers().last().click();
  browser.sleep(500);
  registerPage.getDropdownItems().first().click();
  registerPage.getInputs().get(3).sendKeys(zip);
}

function addPaymentFormData(registerPage: RegisterPage) {
  browser.sleep(600);
  registerPage.getInputs().get(0).sendKeys(ccNumber);
  registerPage.getInputs().get(1).sendKeys(ccv);
  registerPage.getDropdownTriggers().first().click();
  browser.sleep(500);
  registerPage.getDropdownItems().last().click();
  registerPage.getDropdownTriggers().last().click();
  browser.sleep(500);
  registerPage.getDropdownItems().last().click();
}

function clickNextButton(registerPage: RegisterPage) {
  browser.sleep(600);
  registerPage.getNextButton().click();
}

function clickPreviousButton(registerPage: RegisterPage) {
  browser.sleep(600);
  registerPage.getPreviousButton().click();
}
