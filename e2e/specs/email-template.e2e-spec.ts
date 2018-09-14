import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {tosCheck, login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';
import {EmailTemplatePage} from '../po/email-template.po';

describe('Email Template', function() {
  let page: EntityIndexPage;
  let emailTemplate: EmailTemplatePage;

  beforeEach(() => {
    page = new EntityIndexPage();
    emailTemplate = new EmailTemplatePage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should navigate to email templates page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(11).click();
    waitForUrlContains('emailtemplates');
    expectUrlToContain('emailtemplates');
  });



});
