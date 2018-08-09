import {waitForUrlContains, clearLocalStorage, waitForPresenceOf} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {login, tosCheck} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {ProductSchedulePage} from '../po/product-schedule.po';

describe('Product Schedules', function() {
  let page: EntityIndexPage;
  let productSchedulePage: ProductSchedulePage;

  beforeEach(() => {
    page = new EntityIndexPage();
    productSchedulePage = new ProductSchedulePage();
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
    browser.restart();
  });

  it('should navigate to products page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(10).click();
    waitForUrlContains('productschedules');
    expectUrlToContain('productschedules');
  });

  it('should render product schedules index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render product schedules index title', () => {
    expect(page.getTitle().getText()).toContain('Product Schedules');
  });

  it('should render product schedules index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();
    expectDefined(productSchedulePage.getNewProductScheduleForm());
  });

  it('should show show errors when try to submit empty form', () => {
    productSchedulePage.getNewProductScheduleSaveButton().click();
    expect(productSchedulePage.getErrorInputs().count()).toBeGreaterThan(1);
  });

  it('should remove errors when form is valid', () => {
    productSchedulePage.getNewProductScheduleInputs().get(0).sendKeys('e2e product schedule');
    browser.sleep(500);
    expect(productSchedulePage.getErrorInputs().count()).toEqual(0);
  });

  it('should create new product schedule and redirect product schedule view', () => {
    productSchedulePage.getNewProductScheduleSaveButton().click();
    waitForUrlContains('productschedules/');
    expectUrlToContain('productschedules/');
  });

  it('should display product schedule details', () => {
    browser.sleep(2000);
    expect(productSchedulePage.getProductScheduleName().getText()).toEqual('e2e product schedule');
    expect(productSchedulePage.getAssociatedSchedulesRows().count()).toEqual(0);
  });

  it('should update product schedules', () => {
    productSchedulePage.getDetailsMenuButton().click();
    browser.sleep(500);
    productSchedulePage.getMenuButton(0).click();
    browser.sleep(200);
    productSchedulePage.getNewProductScheduleInputs().get(0).sendKeys(' updated');
    productSchedulePage.getNewProductScheduleSaveButton().click();
  });

  it('should persist updated product schedule details', () => {
    browser.sleep(2000);
    expect(productSchedulePage.getProductScheduleName().getText()).toEqual('e2e product schedule updated');
  });

  it('should jump to cycles section', () => {
    productSchedulePage.getProductScheduleSubnav().get(1).click();
    waitForUrlContains('cycles');
    expectUrlToContain('cycles');
  });

  it('should add new product to cycle', () => {
    browser.sleep(500);
    productSchedulePage.getAddProductToScheduleButton().click();
    browser.sleep(200);
    productSchedulePage.getAutoCompleteOption().click();
    browser.sleep(200);
    productSchedulePage.getSaveProductToScheduleButton().click();
    expect(productSchedulePage.getProductIsScheduledName().getText()).toContain('e2e product');
  });

  it('should jump to list section', () => {
    productSchedulePage.getProductScheduleSubnav().get(2).click();
    waitForUrlContains('list');
    expectUrlToContain('list');
  });

  it('should jump to campaigns section', () => {
    productSchedulePage.getProductScheduleSubnav().get(3).click();
    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should remove added schedule', () => {
    productSchedulePage.getProductSchedIndexButton().click();
    browser.sleep(3000);
    productSchedulePage.getProdSchedDeleteButton().click();
    browser.sleep(500);
    productSchedulePage.getConfirmDeleteButton().click();
    waitForPresenceOf(productSchedulePage.getSuccessSnackbar());
    expect(productSchedulePage.getSuccessSnackbar().getText()).toEqual('Deleted Successfully!')
  });

});
