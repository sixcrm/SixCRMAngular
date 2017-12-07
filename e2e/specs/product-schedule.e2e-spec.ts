import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {ProductSchedulePage} from '../po/product-schedule.po';

fdescribe('Product Schedules', function() {
  let page: EntityIndexPage;
  let productSchedulePage: ProductSchedulePage;

  beforeEach(() => {
    page = new EntityIndexPage();
    productSchedulePage = new ProductSchedulePage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should navigate to products page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(14).click();
    waitForUrlContains('productschedules');
    expectUrlToContain('productschedules');
  });

  it('should render product schedules index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render product schedules index title', () => {
    expect(page.getTitle().getText()).toContain('Product Schedules')
  });

  it('should render product schedules index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render product schedules index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Load Balancer');
    expect(page.getTableHeaders().get(2).getText()).toEqual('Number of Cycles');
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
    productSchedulePage.getNewProductScheduleInputs().get(1).click();
    browser.sleep(1500);
    productSchedulePage.getAutoCompleteOption().click();
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

  it('should add new schedule', () => {
    productSchedulePage.getAddScheduleInputs().get(0).click();
    browser.sleep(500);
    productSchedulePage.getAutoCompleteOption().click();
    browser.sleep(500);
    productSchedulePage.getAddScheduleAddButton().click();
    browser.sleep(2000);

    expect(productSchedulePage.getAssociatedSchedulesRows().count()).toEqual(1);
  });

  it('should remove added schedule', () => {
    productSchedulePage.getTableRowOptionsButton().click();
    browser.sleep(500);

    productSchedulePage.getMenuButton(2).click();
    browser.sleep(500);
    productSchedulePage.getConfirmDeleteButton().click();
    browser.sleep(2000);

    expect(productSchedulePage.getAssociatedSchedulesRows().count()).toEqual(0);
  })

});
