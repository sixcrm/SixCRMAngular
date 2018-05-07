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

  it('should send proper invite for user', (doneCallback) => {
    let jwt = createTestAuth0JWT('e2e-test-admin@sixcrm.com');
    let request = supertest(environment.bareEndpoint);

    request.post('graph/d3fa3bf3-7111-49f4-8261-87674482bf1c')
      .set('Authorization', jwt)
      .send(sendInvite('e2e-test-user@sixcrm.com'))
      .end((err, response) => {
        let link = response.body.response.data.inviteuser.link;

        link = link.replace('https://development-admin.sixcrm.com', '');
        link = link.replace('https://staging-admin.sixcrm.com', '');
        link = link.replace('https://admin.sixcrm.com', '');

        browser.get(link);
        browser.sleep(200);

        waitForUrlContains('acceptinvite/');
        expectUrlToContain('acceptinvite/');

        doneCallback();
      });
  });

  it('should display welcome modal and accept button when user opens sent link', () => {
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getAcceptInviteDialog();
    acceptInvitePage.getAcceptButton();
     browser.sleep(500);
     expect(acceptInvitePage.getAcceptInviteDialog().isPresent()).toBeTruthy();
     expect(acceptInvitePage.getAcceptButton().isPresent()).toBeTruthy();
  });
/*
  it('should accept invite', () => {
      browser.waitForAngularEnabled(false);
      //browser.sleep(500);
      acceptInvitePage.getAcceptButton().click();
      browser.sleep(4500);
    expect(acceptInvitePage.getWelcomeText().getText()).toContain(`Great! We've added you to the account.`);
    });

  it('should show acl switch graphics', () => {
        expect(acceptInvitePage.getAclSwitchGraphics().isPresent()).toBeTruthy();
      });

      it('should navigate to dashboard after invite accepted', () => {
        browser.waitForAngularEnabled(false);

        acceptInvitePage.getContinueButton().click();

        browser.sleep(1000);

        waitForUrlContains('dashboard');
        expectUrlToContain('dashboard');
      });

      it('should send proper invite for new user', () => {

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

            // doneCallback();
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

      it('should not show acl switch graphics', () => {
        expect(acceptInvitePage.getAclSwitchGraphics().isPresent()).toBeFalsy();
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
        browser.sleep(1200);
        waitForUrlContains('/accounts/d3fa3bf3-7111-49f4-8261-87674482bf1c');
        expectUrlToContain('/accounts/d3fa3bf3-7111-49f4-8261-87674482bf1c');
      });

      it('should have more than one user', () => {
        browser.waitForAngularEnabled(false);

        accountPage.getTabs().get(1).click();
        browser.sleep(600);

        expect(accountPage.getAssociatedUsers().count()).toBeGreaterThan(2);
      });

      it('should remove all except owner user', () => {
        browser.waitForAngularEnabled(false);

        browser.sleep(600);

        accountPage.getAssociatedUsers().count().then(count => {
          for (let i = 0; i < count - 2; i++) {
            accountPage.getLastUserButton().click();
            browser.sleep(200);
            accountPage.getRemoveUserButton().click();
            browser.sleep(200);
            accountPage.getConfirmDeleteButton().click();
            browser.sleep(2000);
          }

          expect(accountPage.getAssociatedUsers().count()).toBe(2);
          // doneFunction();
        });
      });

     */

});
