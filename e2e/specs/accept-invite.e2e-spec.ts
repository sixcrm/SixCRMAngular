import {AuthPage} from '../po/auth.po';
import {browser} from 'protractor';
import {createTestAuth0JWT} from '../utils/jwt.utils';
import {deleteUser} from '../utils/graph.utils';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {
  waitForUrlContains, navigateSuperuserToHomepage, waitForPresenceOfLoginFields, clearLocalStorage
} from '../utils/navigation.utils';
import {doLogin} from '../utils/action.utils';
import {sha1} from '@angular/compiler/src/i18n/digest';
import {ErrorPage} from '../po/error-page.po';

var supertest = require('supertest');
var crypto = require('crypto');

describe('Accept Invite', function() {
  let authPage: AuthPage;
  let acceptInvitePage: AcceptInvitePage;
  let errorPage: ErrorPage;

  let inviteeEmail = 'testingregistration@example.com';
  let inviteePassword = 'testingregistrationpassword';
  let link = generateDummyInviteLink();

  beforeEach(() => {
    authPage = new AuthPage();
    acceptInvitePage = new AcceptInvitePage();
    errorPage = new ErrorPage();
    browser.waitForAngularEnabled(true);
  });

  afterEach((done) => {
    clearLocalStorage();

    let jwt = createTestAuth0JWT('super.user@test.com');
    let request = supertest('https://development-api.sixcrm.com/');

    request.post('graph/*')
      .set('Authorization', jwt)
      .send(deleteUser(inviteeEmail))
      .end(() => done());
  });

  it('should display message with invitee\'s email if non logged in user tries to accept invite', () => {
    acceptInvitePage.navigateTo(link);

    waitForUrlContains('acceptinvite');

    expect(acceptInvitePage.getAcceptInviteDialog().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getLoginButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getCancelButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getTitle().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getTitle().getText()).toContain(inviteeEmail);
  });

  it('should display message with invitee\'s email if different logged in user tries to accept invite', () => {
    navigateSuperuserToHomepage();

    acceptInvitePage.navigateTo(link);
    waitForUrlContains('acceptinvite');

    expect(acceptInvitePage.getAcceptInviteDialog().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getLoginButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getCancelButton().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getTitle().isPresent()).toBeTruthy();
    expect(acceptInvitePage.getTitle().getText()).toContain(inviteeEmail);
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
    expect(acceptInvitePage.getWelcomeText().getText()).toContain(`Would you like to accept test@test.com's invite to account "test-account" with role "test-role"`);
    expect(acceptInvitePage.getWelcomeInstructions().getText()).toEqual('Press "Accept" below to continue');
  });

  it('should show 404 when try to accept non existing invite', () => {
    acceptInvitePage.getAcceptButton().click();

    waitForUrlContains('404');

    expect(errorPage.getTitle().getText()).toEqual('Strong Effort.')
  });
});

function generateDummyInviteLink() {
  let pre_encrypted_string =
    'testingregistration@example.com:5db7ed46-75b1-4ecd-b489-e61ef5d1107a:test@test.com:test-account:test-role:'+Math.floor(Date.now() / 1000);

  let invite_token = crypto.createHash('sha1').update('awdawdadawt33209sfsiofjsef'+pre_encrypted_string).digest('hex');
  let encoded_params = new Buffer(pre_encrypted_string).toString('base64');

  return '/acceptinvite?t='+invite_token+'&p='+encoded_params;
}
