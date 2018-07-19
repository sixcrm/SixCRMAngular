import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';

describe('Affiliates', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    view = new EntityViewPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to affiliates page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(15).click();
    waitForUrlContains('affiliates');
    expectUrlToContain('affiliates');
  });

  it('should render affiliates index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render affiliates index title', () => {
    expect(page.getTitle().getText()).toContain('Affiliates');
  });

  it('should render affiliates index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render affiliates index table headers', () => {
    expect(page.getTableHeaders().get(1).getText()).toContain('Name');
    // Have to use contain or regex to pull out the nested tags in in the table headers
    expect(page.getTableHeaders().get(2).getText()).toContain('Affiliate ID');
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();

    expectDefined(view.getAddNewModal());
  });

  it('should show error when try to save without name', () => {
    view.getAddNewModalSave().click();

    expect(view.getAddNewModalInvalidInputs().count()).toBeGreaterThan(0);
  });

  it('should remove error when proper name is entered', () => {
    view.getAddNewModalInputs().first().sendKeys('e2e test affiliate');

    expect(view.getAddNewModalInvalidInputs().count()).toBe(0);
  });

  it('should save affiliate and open it', () => {
    view.getAddNewModalSave().click();

    waitForUrlContains('affiliates/');
    expectUrlToContain('affiliates/');
  });

  it('should render affiliate name correctly', () => {
    browser.sleep(1000);
    expect(view.getEntityNameHeader().getText()).toEqual('e2e test affiliate');
  });

  it('should update affiliate name', () => {
    view.getUpdateButtonHeader().click();
    view.getEntityNameFormHeader().sendKeys(' updated');
    view.getUpdateButtonHeader().click();
    browser.sleep(1000);
    expect(view.getEntityNameHeader().getText()).toEqual('e2e test affiliate updated');
  });

  it('should have no associate trackers', () => {
    expect(view.getAssociatedElements(0).count()).toEqual(0);
  });

  it('should associate tracker', () => {
    view.getAssocitionMenuButton(0).click();
    browser.sleep(200);

    view.getAssociationButton().click();
    browser.sleep(1000);

    view.getAssociationInput().click();
    view.getAssociationInput().sendKeys('t');
    browser.sleep(200);
    view.getFirstAssociationOption(0).click();
    browser.sleep(200);

    view.getAssociateButton().click();

    browser.sleep(3000);

    expect(view.getAssociatedElements(0).count()).toEqual(1);
  });

});
