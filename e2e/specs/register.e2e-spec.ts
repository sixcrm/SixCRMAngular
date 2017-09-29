import {AuthPage} from '../po/auth.po';
import {RegisterPage} from '../po/register.po';
import {browser} from 'protractor';
import {waitForPresenceOfLoginFields, waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {doLogin} from '../utils/action.utils';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {createTestAuth0JWT} from '../utils/jwt.utils';
import {deleteUser} from '../utils/graph.utils';
import {TopnavPage} from '../po/topnav.po';

var supertest = require('supertest');

let registrationUsername = 'testingregistration@example.com';
let registrationPassword = 'testingregistrationpassword';

describe('Register', function() {
  let authPage: AuthPage;
  let registerPage: RegisterPage;
  let appTopNav: TopnavPage;

  beforeEach(() => {
    authPage = new AuthPage();
    registerPage = new RegisterPage();
    appTopNav = new TopnavPage();
  });

  afterAll((done) => {
    browser.waitForAngularEnabled(true);

    removeUser(done);
    clearLocalStorage();
  });

  beforeAll((done) => {
    removeUser(done);

    browser.waitForAngularEnabled(false);
    browser.get('/');
    clearLocalStorage();
  });

  it('should redirect to /dashboard and show registration form when non existing user logs in', () => {
    authPage.navigateTo();

    waitForPresenceOfLoginFields(authPage);

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

    expect(registerPage.getInvalidInputs().count()).toEqual(0);
  });

  it('should render registration success', () => {
    registerPage.getContinueButton().click();
    browser.sleep(2000);

    expect(registerPage.getSuccessTitle().getText()).toContain('Your account is now active and you may begin exploring at your leisure.')
  });
});

function removeUser(done) {
  let jwt = createTestAuth0JWT('super.user@test.com');
  let request = supertest('https://development-api.sixcrm.com/');

  request.post('graph/*')
    .set('Authorization', jwt)
    .send(deleteUser(registrationUsername))
    .then(response => console.log(response))
    .end(() => done());
}
