import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
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

  it('should navigate to merchant provider page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(21).click();
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
    merchantProvider.getNewFormInput(2).sendKeys('123');
    merchantProvider.getNewFormInput(3).sendKeys('123');
    merchantProvider.getNewFormInput(4).sendKeys('123');
    merchantProvider.getNewFormInput(5).sendKeys('1');
    merchantProvider.getNewFormInput(6).sendKeys('0.1');
    merchantProvider.getNewFormInput(7).sendKeys('0.1');
    merchantProvider.getNewFormInput(8).sendKeys('0.1');
    merchantProvider.getNewFormInput(9).sendKeys('MNI');

    merchantProvider.getDropdown(0).click();
    browser.sleep(1000);
    merchantProvider.getDropdownOption().click();

    merchantProvider.getNewFormInput(10).sendKeys('123');
    merchantProvider.getNewFormInput(11).sendKeys('123');
    merchantProvider.getNewFormInput(12).sendKeys('123');

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

  xit( 'should go back to campaign index', () =>  {
    merchantProvider.getMerchantIndexButton().click();
    browser.sleep(500);
    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');
  });

  xit('should delete merchant provider', () => {

    browser.sleep(500);
    merchantProvider.getMerchantDeleteButton().click();
    browser.sleep(200);
    merchantProvider.getMerchantDeleteModalButton().click();
    browser.sleep(3000);
    expect(merchantProvider.getMerchantIndividualCampaign().count()).toEqual(0);
  });

});
