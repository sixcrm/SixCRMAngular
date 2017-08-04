import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {browser} from 'protractor';
import {
  waitForPresenceOfLoginFields, waitForUrlContains,
  navigateRegisteruserToRegistration, waitForPresenceOf, clearLocalStorage
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

  afterEach((done) => {
    clearLocalStorage();
    done();
  });

  afterAll((done) => {
    let jwt = createTestAuth0JWT('super.user@test.com');
    let request = supertest('https://api.sixcrm.com/');

    request.post('graph/*')
      .set('Authorization', jwt)
      .send(deleteMutation(registrationUsername))
      .end(() => done());
  });

  it('should redirect to /dashboard and show registration form when non existing user logs in', () => {
    authPage.navigateTo();

    waitForPresenceOfLoginFields(authPage);
    browser.waitForAngularEnabled(false);

    doLogin(authPage, registrationUsername, registrationPassword);

    // Wait for angular is disabled, so we need to tell protractor to wait for page to load
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

    registerPage.getContinueButton().click();

    expect(registerPage.getInvalidInputs().count()).toEqual(0);
  });

  it('should navigate to address form when sign up details are valid', () => {

  });

  it('should show errors if inputs of address form are invalid', () => {

  });

  it('should remove errors if inputs of address form get corrected', () => {

  });

  it('should navigate to payment form when address form details are valid', () => {
  });

  it('should show errors if inputs of payment form are invalid', () => {
  });

  it('should remove errors if inputs of payment form get corrected', () => {
  });

  it('should display confirmation details when payment form details are valid', () => {
  });

  it('should be able to go back and modify details', () => {
  });

  it('should display terms and conditions', () => {
  });

  it('should display error if \'full name\' on terms and conditions screen does not match', () => {
  });

  it('should complete registration if terms and conditions accepted', () => {

  });

  it('should show thank you screen when user who accepted terms and conditions logs in', () => {
    navigateRegisteruserToRegistration();
  })
});

function addSignupFormData(registerPage: RegisterPage) {
  browser.sleep(600);
  registerPage.getInputs().get(0).sendKeys(username);
  registerPage.getInputs().get(1).sendKeys(firstName);
  registerPage.getInputs().get(2).sendKeys(lastName);
}
