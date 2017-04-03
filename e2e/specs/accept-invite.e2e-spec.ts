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

var supertest = require('supertest');

describe('Accept Invite', function() {
  let authPage: AuthPage;
  let acceptInvitePage: AcceptInvitePage;

  let inviteeEmail = 'testingregistration@example.com';
  let inviteePassword = 'testingregistrationpassword';
  let link = '/acceptinvite?t=776e2d57b9662e83c738655cebbe9451b53826bc&p=dGVzdGluZ3JlZ2lzdHJhdGlvbkBleGFtcGxlLmNvbTo0NzE5NzhjZC0zOTAxLTRlZjMtYjFmYS0wZjBkYzZjN2Y4Njg6MTExNmMwNTQtNDJiYi00YmY1LTg0MWUtZWUwYzQxM2ZhNjllOjE0OTA5NjU5NjM=';

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
    expect(acceptInvitePage.getAcceptButton().isEnabled()).toBeFalsy();

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
    expect(acceptInvitePage.getRegistrationCompleteInstructions().getText()).toEqual('Registration Complete');
  });

  it('should navigate to dashboard after registration complete', () => {
    navigateRegisteruserToAcceptInvite(link);
    browser.sleep(1000);

    acceptInvitePage.getAcceptButton().click();

    browser.sleep(600);
    acceptInvitePage.getAcceptButton().click();

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  })
});
