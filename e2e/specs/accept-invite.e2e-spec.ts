import {AuthPage} from '../po/auth.po';
import {browser} from 'protractor';
import {createTestAuth0JWT} from '../utils/jwt.utils';
import {sendInvite} from '../utils/graph.utils';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {
  waitForUrlContains, navigateSuperuserToHomepage, waitForPresenceOfLoginFields, clearLocalStorage
} from '../utils/navigation.utils';
import {doLogin, login, doSignUp} from '../utils/action.utils';
import {sha1} from '@angular/compiler/src/i18n/digest';
import {ErrorPage} from '../po/error-page.po';
import {environment} from '../../src/environments/environment';
import {expectUrlToContain} from '../utils/assertation.utils';
import {TopnavPage} from '../po/topnav.po';
import {ProfilePage} from '../po/profile.po';
import {AccountPage} from '../po/account.po';
import {TermsAndConditionsPage} from '../po/terms-and-conditions.po';

var supertest = require('supertest');
var crypto = require('crypto');

let newEmail = `e2e${new Date().getTime()}@sixcrm.com`;
let newPassword = '123456789';

describe('Accept Invite', function() {
  let authPage: AuthPage;
  let acceptInvitePage: AcceptInvitePage;
  let errorPage: ErrorPage;
  let profilePage: ProfilePage;
  let topnavPage: TopnavPage;
  let accountPage: AccountPage;
  let termsAndConditionsPage: TermsAndConditionsPage;

  let inviteeEmail = 'testingregistration@example.com';
  let inviteePassword = 'testingregistrationpassword';
  let link = generateDummyInviteLink();

  beforeEach(() => {
    authPage = new AuthPage();
    acceptInvitePage = new AcceptInvitePage();
    errorPage = new ErrorPage();
    profilePage = new ProfilePage();
    topnavPage = new TopnavPage();
    accountPage = new AccountPage();
    termsAndConditionsPage = new TermsAndConditionsPage();

    browser.waitForAngularEnabled(true);
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

  it('should send proper invite for existing user', (doneCallback) => {

    let jwt = createTestAuth0JWT('e2e-test-admin@sixcrm.com');
    let request = supertest(environment.bareEndpoint);

    request.post('graph/d3fa3bf3-7111-49f4-8261-87674482bf1c')
      .set('Authorization', jwt)
      .send(sendInvite('e2e-test-user@sixcrm.com'))
      .end((err, response) => {
        let link = response.body.response.data.inviteuser.link;
        const envUrl = environment.auth0RedirectUrl;

        if (envUrl === 'http://localhost:4200') {
          link = link.replace('https://development-admin.sixcrm.com', 'http://localhost:4200');
        }

        browser.get(link);
        browser.sleep(1000);
        expect(acceptInvitePage.getTitle().getText()).toContain('e2e-test-user@sixcrm.com');

        doneCallback();
      });
  });

  it('should display message when logged in user opens proper invite link', () => {
    acceptInvitePage.getLoginButton().click();

    waitForPresenceOfLoginFields(authPage);
    browser.waitForAngularEnabled(false);

    doLogin(authPage, 'e2e-test-user@sixcrm.com', '123456789');
    waitForUrlContains('acceptinvite');

    browser.sleep(1000);
    expect(acceptInvitePage.getWelcomeText().getText()).toContain(`Would you like to accept e2e-test-admin@sixcrm.com's invite to account "E2E Test Acc" with role "Administrator"?`);
    expect(acceptInvitePage.getWelcomeInstructions().getText()).toEqual('Press "Accept" below to continue');
  });

  it('should accept invite and display welcome message message', () => {
    browser.waitForAngularEnabled(false);

    acceptInvitePage.getAcceptButton().click();

    browser.sleep(1000);

    expect(acceptInvitePage.getWelcomeText().getText()).toContain(`Great! We've added you to the account.`);
  });

  it('should navigate to dashboard after invite accepted', () => {
    browser.waitForAngularEnabled(false);

    acceptInvitePage.getContinueButton().click();

    browser.sleep(1000);

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  });

  it('should send proper invite for new user', (doneCallback) => {

    let jwt = createTestAuth0JWT('e2e-test-admin@sixcrm.com');
    let request = supertest(environment.bareEndpoint);

    request.post('graph/d3fa3bf3-7111-49f4-8261-87674482bf1c')
      .set('Authorization', jwt)
      .send(sendInvite(newEmail))
      .end((err, response) => {
        let link = response.body.response.data.inviteuser.link;
        const envUrl = environment.auth0RedirectUrl;

        if (envUrl === 'http://localhost:4200') {
          link = link.replace('https://development-admin.sixcrm.com', 'http://localhost:4200');
        }

        browser.get(link);
        browser.sleep(1000);
        expect(acceptInvitePage.getTitle().getText()).toContain(newEmail);

        doneCallback();
      });
  });

  it('should display message when new user opens proper invite link', () => {
    acceptInvitePage.getLoginButton().click();

    waitForPresenceOfLoginFields(authPage);
    browser.waitForAngularEnabled(false);

    doSignUp(authPage, newEmail, newPassword);
    waitForUrlContains('acceptinvite');

    browser.sleep(1000);
    expect(acceptInvitePage.getWelcomeText().getText()).toContain(`Would you like to accept e2e-test-admin@sixcrm.com's invite to account "E2E Test Acc" with role "Administrator"?`);
    expect(acceptInvitePage.getWelcomeInstructions().getText()).toEqual('Press "Accept" below to continue');
  });

  it('should accept invite of new user and display info form', () => {
    browser.waitForAngularEnabled(false);

    acceptInvitePage.getAcceptButton().click();

    browser.sleep(1000);

    acceptInvitePage.getInputs().first().sendKeys('firstanem');
    acceptInvitePage.getInputs().last().sendKeys('lastname');

    acceptInvitePage.getContinueButton().click();
  });

  it('should display welcome message message', () => {
    browser.waitForAngularEnabled(false);
    browser.sleep(1000);

    expect(acceptInvitePage.getWelcomeText().getText()).toContain(`Great! We've added you to the account.`);
  });

  it('should navigate to terms and conditions', () => {
    browser.waitForAngularEnabled(false);

    acceptInvitePage.getContinueButton().click();

    browser.sleep(1000);

    waitForUrlContains('terms-and-conditions');
    expectUrlToContain('terms-and-conditions');
  });

  it('should navigate to dashboard after accepting terms and conditions', () => {
    browser.waitForAngularEnabled(false);

    termsAndConditionsPage.getAcceptButton().click();

    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');
  });

  it('should login as admin and open profile page', () => {
    browser.waitForAngularEnabled(false);
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
    expectUrlToContain('dashboard');

    topnavPage.getProfileMenuButton().click();
    browser.sleep(200);

    topnavPage.getUserSettingsMenuOption().click();
    browser.sleep(200);
    expectUrlToContain('profile');
  });

  it('should open account page', () => {
    browser.waitForAngularEnabled(false);

    profilePage.getAccountsTabButton().click();
    browser.sleep(600);
    profilePage.getFirstAccount().click();
    browser.sleep(600);
    waitForUrlContains('/accounts/d3fa3bf3-7111-49f4-8261-87674482bf1c');
    expectUrlToContain('/accounts/d3fa3bf3-7111-49f4-8261-87674482bf1c');
  });

  it('should have more than one user', () => {
    browser.waitForAngularEnabled(false);

    expect(accountPage.getAssociatedUsers().count()).toBeGreaterThan(2);
  });

  it('should remove all except owner user', (doneFunction) => {
    browser.waitForAngularEnabled(false);

    accountPage.getAssociatedUsers().count().then(count =>{
      for (let i = 0; i < count - 2; i++) {
        accountPage.getLastUserButton().click();
        browser.sleep(200);
        accountPage.getRemoveUserButton().click();
        browser.sleep(200);
        accountPage.getConfirmDeleteButton().click();
        browser.sleep(2000);
      }

      expect(accountPage.getAssociatedUsers().count()).toBe(2);
      doneFunction();
    });
  });
});

function generateDummyInviteLink() {
  let pre_encrypted_string =
    'testingregistration@example.com:5db7ed46-75b1-4ecd-b489-e61ef5d1107a:test@test.com:test-account:test-role:'+Math.floor(Date.now() / 1000);

  let invite_token = crypto.createHash('sha1').update('awdawdadawt33209sfsiofjsef'+pre_encrypted_string).digest('hex');
  let encoded_params = new Buffer(pre_encrypted_string).toString('base64');

  return '/acceptinvite?t='+invite_token+'&p='+encoded_params;
}
