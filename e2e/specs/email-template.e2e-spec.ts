import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
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
  let view: EntityViewPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    emailTemplate = new EmailTemplatePage();
    view = new EntityViewPage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    tosCheck(done);
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to email templates page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(15).click();
    waitForUrlContains('emailtemplates');
    expectUrlToContain('emailtemplates');
  });

  it('should render email templates index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render email templates index title', () => {
    expect(page.getTitle().getText()).toContain('Email Template');
  });

  it('should render email templates index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();
    expectDefined(emailTemplate.getNewForm());
  });

  it('should show errors when try to submit empty form', () => {
    emailTemplate.getNewFormSaveButton().click();
    expect(emailTemplate.getErrorInputs().count()).toBeGreaterThan(1);
  });

  it('should remove errors when form is valid', () => {
    browser.sleep(2000);
    emailTemplate.getNewFormInputs().get(0).sendKeys('e2e email template');
    emailTemplate.getNewFormInputs().get(1).sendKeys('e2e email template subject');

    emailTemplate.getDropdown(0).click();
    browser.sleep(200);
    emailTemplate.getDropdownOption().click();
    browser.sleep(200);

    emailTemplate.getDropdown(1).click();
    browser.sleep(200);
    emailTemplate.getDropdownOption().click();
    browser.sleep(200);

    expect(emailTemplate.getErrorInputs().count()).toEqual(0);
  });

  it('should create new product schedule and redirect email template view', () => {
    emailTemplate.getNewFormSaveButton().click();
    waitForUrlContains('emailtemplates/');
    expectUrlToContain('emailtemplates/');
  });

  it('should display email template details', () => {
    browser.sleep(2000);
    expect(view.getEntityNameHeaderSolo().getText()).toEqual('e2e email template');
  });

});
