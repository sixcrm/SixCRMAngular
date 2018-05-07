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
import {expectUrlToContain, expectNotPresent, expectPresent, expectDefined } from '../utils/assertation.utils';
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
     expectPresent(acceptInvitePage.getAcceptInviteDialog());
     expect(acceptInvitePage.getAcceptButton().isPresent()).toBeTruthy();
  });

  it('should accept invite and proceed to auth0 sign up', () => {
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getAcceptButton().click();
    browser.sleep(5000);
    acceptInvitePage.getAuth0SignUpTab().click();
    expect(acceptInvitePage.getAuth0SignUpTab().last().getText()).toEqual('Sign Up');
    });

});
