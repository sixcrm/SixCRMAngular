import {AuthPage} from '../po/auth.po';
import {browser} from 'protractor';
import {createTestAuth0JWT} from '../utils/jwt.utils';
import {deleteMutation} from '../utils/graph.utils';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {
  waitForUrlContains, navigateSuperuserToHomepage, waitForPresenceOfLoginFields,
  navigateRegisteruserToAcceptInvite, clearLocalStorage
} from '../utils/navigation.utils';
import {doLogin} from '../utils/action.utils';
import {expectUrlToContain} from '../utils/assertation.utils';
import {sha1} from '@angular/compiler/src/i18n/digest';

var supertest = require('supertest');
var crypto = require('crypto');

describe('Accept Invite', function() {
  let authPage: AuthPage;
  let acceptInvitePage: AcceptInvitePage;

  let inviteeEmail = 'testingregistration@example.com';
  let inviteePassword = 'testingregistrationpassword';
  let link = generateInviteLink();

  beforeEach(() => {
    authPage = new AuthPage();
    acceptInvitePage = new AcceptInvitePage();
    browser.waitForAngularEnabled(true);
  });

  afterEach((done) => {
    clearLocalStorage();

    let jwt = createTestAuth0JWT('super.user@test.com');
    let request = supertest('https://api.sixcrm.com/');

    request.post('graph/*')
      .set('Authorization', jwt)
      .send(deleteMutation(inviteeEmail))
      .end(() => done());
  });

  it('should display message with invitee\'s email if non logged in user tries to accept invite', () => {
    acceptInvitePage.navigateTo(link);

    browser.pause();

    waitForUrlContains('acceptinvite');

    expect(acceptInvitePage.getAcceptInviteDialog().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getLoginButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getCancelButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getInviteeEmail().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getInviteeEmail().getText()).toBe(inviteeEmail);
  });

  it('should display message with invitee\'s email if different logged in user tries to accept invite', () => {
    navigateSuperuserToHomepage();

    acceptInvitePage.navigateTo(link);
    waitForUrlContains('acceptinvite');

    expect(acceptInvitePage.getAcceptInviteDialog().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getLoginButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getCancelButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getInviteeEmail().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getInviteeEmail().getText()).toBe(inviteeEmail);
  });

  it('should redirect to accept invite and show welcome message if invitee gets logged in', () => {
    acceptInvitePage.navigateTo(link);
    waitForUrlContains('acceptinvite');

    acceptInvitePage.getLoginButton().click();

    waitForPresenceOfLoginFields(authPage);
    browser.waitForAngularEnabled(false);

    doLogin(authPage, inviteeEmail, inviteePassword);
    waitForUrlContains('acceptinvite');

    browser.sleep(1000);
    expect(acceptInvitePage.getWelcomeText().getText()).toEqual('You were invited to SIX CRM by [user placeholder] of [company placeholder]')
    expect(acceptInvitePage.getWelcomeInstructions().getText()).toEqual('Press "accept" below to continue');
  });

  it('should show welcome message if invitee is correctly logged in', () => {
    navigateRegisteruserToAcceptInvite(link);

    browser.sleep(1000);
    expect(acceptInvitePage.getWelcomeText().getText()).toEqual('You were invited to SIX CRM by [user placeholder] of [company placeholder]')
    expect(acceptInvitePage.getWelcomeInstructions().getText()).toEqual('Press "accept" below to continue');
  });

  it('should display \'registration lite\' form when user accepts invite', () => {
    navigateRegisteruserToAcceptInvite(link);
    browser.sleep(1000);

    acceptInvitePage.getAcceptButton().click();

    expect(acceptInvitePage.getInputs().count()).toBe(3);
    expect(acceptInvitePage.getAcceptButton().isPresent()).toBeTruthy();
  });

  it('should display errors on registration form when inputs are invalid', () => {
    navigateRegisteruserToAcceptInvite(link);
    browser.sleep(1000);

    acceptInvitePage.getAcceptButton().click();

    acceptInvitePage.getInputs().get(0).sendKeys('a');
    acceptInvitePage.getInputs().get(1).sendKeys('a');
    acceptInvitePage.getInputs().get(2).sendKeys('a');

    browser.sleep(600);
    acceptInvitePage.getAcceptButton().click();

    browser.sleep(600);
    expect(acceptInvitePage.getAcceptButton().isEnabled()).toBeFalsy();
    expect(acceptInvitePage.getErrorHints().count()).toEqual(3);
    expect(acceptInvitePage.getErrorHints().get(0).getText()).toEqual('more than two characters please!');
    expect(acceptInvitePage.getErrorHints().get(1).getText()).toEqual('more than two characters please!');
    expect(acceptInvitePage.getErrorHints().get(2).getText()).toEqual('more than four characters please!');
  });

  it('should remove errors on registration form when inputs get corrected', () => {
    navigateRegisteruserToAcceptInvite(link);
    browser.sleep(1000);

    acceptInvitePage.getAcceptButton().click();

    acceptInvitePage.getInputs().get(0).sendKeys('a');
    acceptInvitePage.getInputs().get(1).sendKeys('a');
    acceptInvitePage.getInputs().get(2).sendKeys('a');

    browser.sleep(600);
    acceptInvitePage.getAcceptButton().click();

    browser.sleep(600);
    acceptInvitePage.getInputs().get(0).sendKeys('regFirstName');
    expect(acceptInvitePage.getAcceptButton().isEnabled()).toBeFalsy();

    acceptInvitePage.getInputs().get(1).sendKeys('regLastName');
    expect(acceptInvitePage.getAcceptButton().isEnabled()).toBeFalsy();

    acceptInvitePage.getInputs().get(2).sendKeys('regUsername');

    browser.sleep(600);
    expect(acceptInvitePage.getAcceptButton().isEnabled()).toBeTruthy();
  });

  it('should display registration complete page on registration completed', () => {
    navigateRegisteruserToAcceptInvite(link);
    browser.sleep(1000);

    acceptInvitePage.getAcceptButton().click();

    acceptInvitePage.getInputs().get(0).sendKeys('regFirstName');
    acceptInvitePage.getInputs().get(1).sendKeys('regLastName');
    acceptInvitePage.getInputs().get(2).sendKeys('regUsername');

    browser.sleep(600);
    acceptInvitePage.getAcceptButton().click();

    browser.sleep(600);

    expect(acceptInvitePage.getRegistrationCompleteMessage().getText()).toEqual('Registration Complete');
    expect(acceptInvitePage.getRegistrationCompleteInstructions().getText()).toEqual('You will receive an email confirming your account shortly');
  });

 it('should navigate to dashboard after registration complete', () => {
    navigateRegisteruserToAcceptInvite(link);
    browser.sleep(1000);

    acceptInvitePage.getAcceptButton().click();

    acceptInvitePage.getInputs().get(0).sendKeys('regFirstName');
    acceptInvitePage.getInputs().get(1).sendKeys('regLastName');
    acceptInvitePage.getInputs().get(2).sendKeys('regUsername');

    browser.sleep(600);
    acceptInvitePage.getAcceptButton().click();

    browser.sleep(600);
    acceptInvitePage.getAcceptButton().click();

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  })
});

function generateInviteLink() {
  let pre_encrypted_string = 'testingregistration@example.com:5db7ed46-75b1-4ecd-b489-e61ef5d1107a:1116c054-42bb-4bf5-841e-ee0c413fa69e:'+Math.floor(Date.now() / 1000);

  let invite_token = crypto.createHash('sha1').update('awdawdadawt33209sfsiofjsef'+pre_encrypted_string).digest('hex');
  let encoded_params = new Buffer(pre_encrypted_string).toString('base64');

  return '/acceptinvite?t='+invite_token+'&p='+encoded_params;
}
