import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login} from '../utils/action.utils';
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

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should navigate to merchantProviderGroup page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(17).click();
    browser.sleep(500);
    sidenav.getLink(28).click();
    waitForUrlContains('merchantprovidergroup');
    expectUrlToContain('merchantprovidergroup');
  });

  it('should render load balancer index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render load balancer index title', () => {
    expect(page.getTitle().getText()).toContain('Load Balancers')
  });

  it('should render load balancer index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render load balancer index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Number of Merchant Providers');
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

  it('should display product schedule details', () => {
    browser.sleep(2000);
    expect(merchantProviderGroup.getMerchantProviderGroupName().getText()).toEqual('e2e load balancer');
  });

  it('should update load balancer', () => {
    view.getUpdateButtonHeader().click();
    browser.sleep(200);

    view.getEntityNameFormHeader().sendKeys(' updated');
    view.getUpdateButtonHeader().click();
  });

  it('should persist updated load balancer details', () => {
    browser.sleep(2000);

    expect(view.getEntityNameHeader().getText()).toEqual('e2e load balancer updated');
  });

});
