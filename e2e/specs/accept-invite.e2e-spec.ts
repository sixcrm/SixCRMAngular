import {AuthPage} from '../po/auth.po';
import {browser} from 'protractor';
import {createTestAuth0JWT} from '../utils/jwt.utils';
import {sendInvite} from '../utils/graph.utils';
import {AcceptInvitePage} from '../po/accept-invite.po';
import {waitForUrlContains} from '../utils/navigation.utils';
import {ErrorPage} from '../po/error-page.po';
import {environment} from '../../src/environments/environment';
import * as environmentStage from '../../src/environments/environment.stage';
import * as environmentProd from '../../src/environments/environment.prod';
import {expectUrlToContain, expectPresent} from '../utils/assertation.utils';
import {TopnavPage} from '../po/topnav.po';
import {ProfilePage} from '../po/profile.po';
import {AccountPage} from '../po/account.po';
import {TermsAndConditionsPage} from '../po/terms-and-conditions.po';
import {EnvironmentModel} from '../../src/environments/environment-model';

var supertest = require('supertest');
var crypto = require('crypto');

let newEmail = `e2e${new Date().getTime()}@sixcrm.com`;
let newPassword = '123456789';

describe('Accept Invite', function () {
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
    const apiEndpoint = getApiEndpoint();
    let jwt = createTestAuth0JWT('e2e-test-admin@sixcrm.com');
    let request = supertest(apiEndpoint);

    request.post('graph/d3fa3bf3-7111-49f4-8261-87674482bf1c')
      .set('Authorization', jwt)
      .send(sendInvite(newEmail))
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
    browser.sleep(500);
    expectPresent(acceptInvitePage.getAcceptInviteDialog());
    expectPresent(acceptInvitePage.getAcceptButton());
  });

  it('should accept invite and proceed to auth0 sign up', () => {
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getAcceptButton().click();
    browser.sleep(3500);
    waitForUrlContains('/signup');
    expectUrlToContain('/signup');
    expect(acceptInvitePage.getAuth0SignUpTab().last().getText()).toEqual('Sign Up');
  });

  it('should fill sign up info and proceed', () => {
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getInputs().first().sendKeys(newEmail);
    acceptInvitePage.getInputs().last().sendKeys(newPassword);
    browser.sleep(500);
    acceptInvitePage.getAuth0SubmitButton().click();
    browser.sleep(4500);
    waitForUrlContains('/register');
    expectUrlToContain('/register');
  });

  it('should fill in the registration fields and and verify terms and conditions are present', () => {
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getRegisterInputs(0).sendKeys('e2e First');
    acceptInvitePage.getRegisterInputs(1).sendKeys('e2e Last');
    browser.sleep(500);
    expect(acceptInvitePage.getRegisterTitle().getText()).toEqual(`We\'re excited to have you join us`);
    expect(acceptInvitePage.getRegisterTerms().getText()).toEqual(`By accepting this invitation and creating a SIX account, you agree to the End User License Agreement.`);
  });

  it('should submit registration and proceed to dashboard', () => {
    browser.waitForAngularEnabled(false);
    acceptInvitePage.getRegisterAcceptButton().click();
    browser.sleep(5000);
    waitForUrlContains('/dashboard');
    expectUrlToContain('/dashboard');
  });

});

function getApiEndpoint(): string {
  const baseUrl = browser.baseUrl;
  const environments: EnvironmentModel[] = [environment, environmentStage.environment, environmentProd.environment];

  for (let env of environments) {
    if (env.auth0RedirectUrl === baseUrl) {
      return env.bareEndpoint;
    }
  }

  return environment.bareEndpoint;
}
