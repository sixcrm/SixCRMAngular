import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined, expectPresent} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';
import {FulfillmentProviderPage} from '../po/fullfilment-provider.po';

describe('Fulfillment Provider', function() {
  let page: EntityIndexPage;
  let view: EntityViewPage;
  let fulfillmentView: FulfillmentProviderPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    view = new EntityViewPage();
    fulfillmentView = new FulfillmentProviderPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 1200);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to providers page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(17).click();
    browser.sleep(500);
    sidenav.getLink(30).click();
    browser.sleep(500);
    waitForUrlContains('fulfillmentproviders');
    expectUrlToContain('fulfillmentproviders');
  });

  it('should render providers index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render providers index title', () => {
    expect(page.getTitle().getText()).toContain('Fulfillment Provider');
  });

  it('should render providers index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();

    expectDefined(view.getAddNewModal());
  });

  it('should select provider type', () => {
    fulfillmentView.getProviderTypeDropdown().click();
    browser.sleep(200);
    fulfillmentView.getDropdownItem(0).click();
    browser.sleep(200);
  });

  it('should show error when try to save without name', () => {
    view.getAddNewModalSave().click();

    expect(view.getAddNewModalErrorInputs().count()).toBeGreaterThan(0);
  });

  it('should remove error when proper name is entered', () => {
    view.getAddNewModalInputs().get(0).sendKeys('e2e test provider');
    view.getAddNewModalInputs().get(1).sendKeys('e2e username');
    view.getAddNewModalInputs().get(2).sendKeys('e2epassword');
    view.getAddNewModalInputs().get(3).sendKeys('e2ethrepl');
    view.getAddNewModalInputs().get(4).sendKeys('e2efacility');
    view.getAddNewModalInputs().get(5).sendKeys('e2ethrepplid');
    view.getAddNewModalInputs().get(6).sendKeys('e2ecustomer');

    view.getAddNewModalTextarea().click();
    view.getAddNewModalTextarea().sendKeys('some address');

    expect(view.getAddNewModalErrorInputs().count()).toBe(0);
  });

  it('should save provider and open it', () => {
    view.getAddNewModalSave().click();

    waitForUrlContains('fulfillmentproviders/');
    expectUrlToContain('fulfillmentproviders/');
  });

  it('should render provider name correctly', () => {
    browser.sleep(1000);
    expect(view.getEntityNameHeader().getText()).toEqual('e2e test provider');
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(2);
  });

  it('should update provider name', () => {
    view.getFirstCardMenuButton().click();
    browser.sleep(200);
    view.getAssociationButton().click();
    view.gitFirstCardInputs().first().sendKeys(' updated');
    view.getAddNewModalSave().click();
    browser.sleep(1000);
    expect(view.getEntityNameHeaderSolo().getText()).toEqual('e2e test provider updated');
  });

  it('should validate provider', () => {
    view.getTabLabels().get(1).click();
    browser.sleep(1000);
    view.getAddNewModalSave().click();
    browser.sleep(2000);
  });

  it('should show copy icon', () => {
    expectPresent(fulfillmentView.getCopyIcon());
  });

});
