import {waitForUrlContains, clearLocalStorage, waitForPresenceOf, clearAuth0SSO} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {login, tosCheck} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';
import {MerchantProviderPage} from '../po/merchant-provider.po';

describe('Merchant Provider', function() {
  let page: EntityIndexPage;
  let merchantProvider: MerchantProviderPage;
  let view: EntityViewPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    merchantProvider = new MerchantProviderPage();
    view = new EntityViewPage();
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

  it('should navigate to merchant provider page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(15).click();
    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');
  });

  it('should render merchant provider index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render merchant provider index title', () => {
    expect(page.getTitle().getText()).toContain('Merchant Providers');
  });

  it('should render merchant provider index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();
    expectDefined(merchantProvider.getNewForm());
  });

  it('should show errors when try to submit empty form', () => {
    merchantProvider.getNewFormSaveButton().click();
    expect(merchantProvider.getErrorInputs().count()).toBeGreaterThan(1);
  });

  it('should remove errors when form is valid', () => {
    merchantProvider.getNewFormInput(0).sendKeys('e2e merchant provider');
    merchantProvider.getNewFormCheckbox(3).click();
    merchantProvider.getNewFormInput(1).sendKeys('123');
    merchantProvider.getNewFormInput(2).sendKeys('testp');
    merchantProvider.getNewFormInput(3).sendKeys('testd');
    merchantProvider.getNewFormInput(4).sendKeys('123');
    merchantProvider.getNewFormInput(5).sendKeys('123');
    merchantProvider.getNewFormInput(6).sendKeys('123');
    merchantProvider.getNewFormInput(7).sendKeys('123');
    merchantProvider.getNewFormInput(8).sendKeys('1');
    merchantProvider.getNewFormInput(9).sendKeys('0.1');
    merchantProvider.getNewFormInput(10).sendKeys('0.1');
    merchantProvider.getNewFormInput(11).sendKeys('0.1');

    merchantProvider.getDropdown(0).click();
    browser.sleep(1000);
    merchantProvider.getDropdownOption().click();

    merchantProvider.getNewFormInput(12).sendKeys('123');
    merchantProvider.getNewFormInput(13).sendKeys('123');
    merchantProvider.getNewFormInput(14).sendKeys('123');

    expect(merchantProvider.getErrorInputs().count()).toEqual(0);
  });

  it('should create new merchant provider and redirect merchant provider view', () => {
    merchantProvider.getNewFormSaveButton().click();
    waitForUrlContains('merchantproviders/');
    expectUrlToContain('merchantproviders/');
  });

  it('should show merchant provider details', () => {
    browser.sleep(2000);
    expect(view.getEntityNameHeader().getText()).toEqual('e2e merchant provider');
  });

  xit('should update merchant provider', () => {
    view.getUpdateButtonHeader().click();
    browser.sleep(200);
    // browser.pause();
    view.getUpdateMenuButton().click();
    browser.sleep(500);

    view.getEntityNameFormHeader().sendKeys(' updated');
    browser.sleep(5000);
    view.getUpdateButtonHeader().click();
  });

  xit('should persist updated merchant provider details', () => {
    browser.sleep(2000);

    expect(view.getEntityNameHeader().getText()).toEqual('e2e merchant provider updated');
  });

  it('should go back to merchant providers index', () =>  {
    merchantProvider.getMerchantIndexButton().click();
    browser.sleep(500);
    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');
  });

  it('should delete merchant provider', () => {
    browser.sleep(2000);
    merchantProvider.getMerchantDeleteButton().click();
    browser.sleep(200);
    merchantProvider.getMerchantDeleteModalButton().click();
    waitForPresenceOf(page.getSuccessSnackbar());
    expect(page.getSuccessSnackbar().getText()).toEqual('Deleted Successfully!')
  });

});
