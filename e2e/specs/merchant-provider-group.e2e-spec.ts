import {waitForUrlContains, clearLocalStorage, waitForPresenceOf} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login, tosCheck} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';
import {MerchantProviderGroupPage} from '../po/merchant-provider-group.po';

describe('Merchant Provider Group', function() {
  let page: EntityIndexPage;
  let merchantProviderGroup: MerchantProviderGroupPage;
  let view: EntityViewPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    merchantProviderGroup = new MerchantProviderGroupPage();
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

  it('should navigate to merchantProviderGroup page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(22).click();
    waitForUrlContains('merchantprovidergroup');
    expectUrlToContain('merchantprovidergroup');
  });

  it('should render load balancer index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render load balancer index title', () => {
    expect(page.getTitle().getText()).toContain('Merchant Provider Groups');
  });

  it('should render load balancer index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();
    expectDefined(merchantProviderGroup.getNewForm());
  });

  it('should show errors when try to submit empty form', () => {
    merchantProviderGroup.getNewFormSaveButton().click();
    expect(merchantProviderGroup.getErrorInputs().count()).toBeGreaterThan(1);
  });

  it('should remove errors when form is valid', () => {
    merchantProviderGroup.getNewFormInputs().get(0).sendKeys('e2e load balancer');
    expect(merchantProviderGroup.getErrorInputs().count()).toEqual(0);
  });

  it('should create new product schedule and redirect product schedule view', () => {
    merchantProviderGroup.getNewFormSaveButton().click();
    waitForUrlContains('merchantprovidergroups/');
    expectUrlToContain('merchantprovidergroups/');
  });

  xit('should display product schedule details', () => {
    browser.sleep(2000);
    expect(merchantProviderGroup.getMerchantProviderGroupName().getText()).toEqual('e2e load balancer');
  });

  xit('should update load balancer', () => {
    view.getUpdateButtonHeader().click();
    browser.sleep(200);

    view.getEntityNameFormHeader().sendKeys(' updated');
    view.getUpdateButtonHeader().click();
  });

  xit('should persist updated load balancer details', () => {
    browser.sleep(2500);

    expect(view.getEntityNameHeader().getText()).toEqual('e2e load balancer updated');
  });

  it( 'should go back to merchant provider group index', () =>  {
    browser.sleep(1000);
    merchantProviderGroup.getMerchantProviderIndexButton().click();
    waitForUrlContains('merchantprovidergroups');
    expectUrlToContain('merchantprovidergroups');
  });

  it( 'should delete the provider group', () => {
    browser.sleep(2000);
    merchantProviderGroup.getProviderGroupDeleteButton().click();
    browser.sleep(200);
    merchantProviderGroup.getProviderGroupDeleteModalButton().click();
    waitForPresenceOf(page.getSuccessSnackbar());
    expect(page.getSuccessSnackbar().getText()).toEqual('Deleted Successfully!')
  });

});
