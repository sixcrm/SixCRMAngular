import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {tosCheck, login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain} from '../utils/assertation.utils';
import {EmailTemplatePage} from '../po/email-template.po';
import {Key} from 'selenium-webdriver';

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
    nav.getLink(12).click();
    waitForUrlContains('emailtemplates');
    expectUrlToContain('emailtemplates');
  });

  it('should display preset email template', () => {
    browser.sleep(2000);
    expect(emailTemplate.getTemplates().count()).toBeGreaterThan(0);
  });

  it('should display template preview modal', () => {
    emailTemplate.getPreviewButton(0).click();
    expect(emailTemplate.getPreviewModal()).toBeDefined();
    expect(emailTemplate.getPreviewContent().getText()).toEqual('hello, Freeda');
  });

  it('should close preview modal', () => {
    browser.actions().sendKeys(Key.ESCAPE).perform();
    browser.sleep(2000);
    expect(emailTemplate.getPreviewModal().isPresent()).toBeFalsy();
  });

  it('should open email template for editing', () => {
    emailTemplate.getEditButton(0).click();
    expectUrlToContain('emailtemplates/');
  });

  it('should display grapesjs', () => {
    browser.sleep(2000);
    expect(emailTemplate.getGrapesJS().isPresent()).toBeTruthy();
  });

  it('should display token blocks', () => {
    expect(emailTemplate.getGrapesCategoryBlocks().count()).toBeGreaterThanOrEqual(3);
  });

});
