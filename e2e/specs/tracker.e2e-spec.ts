import {waitForUrlContains, clearLocalStorage, clearAuth0SSO} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {NavPage} from '../po/nav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {EntityViewPage} from '../po/entity-view.po';

describe('Trackers', function() {
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
    clearAuth0SSO();
  });

  it('should navigate to trackers page', () => {
    const nav = new NavPage();
    nav.getNavToggler().click();
    nav.getLink(13).click();
    waitForUrlContains('trackers');
    expectUrlToContain('trackers');
  });

  it('should render trackers index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render trackers index title', () => {
    expect(page.getTitle().getText()).toContain('Trackers')
  });

  it('should render trackers index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();

    expectDefined(view.getAddNewModal());
  });

  it('should show error when try to save without name', () => {
    view.getAddNewModalSave().click();

    expect(view.getAddNewModalErrorInputs().count()).toBeGreaterThan(0);
  });

  it('should remove error when proper name is entered', () => {
    view.getAddNewModalInputs().first().sendKeys('e2e test tracker');
    view.getAddNewModalDropdowns().first().click();
    view.getAddNewModalDropdownOptions(0,1).click();
    view.getAddNewModalTextarea().click();
    view.getAddNewModalTextarea().sendKeys('<html>tracking data</html>');

    expect(view.getAddNewModalErrorInputs().count()).toBe(0);
  });

  it('should save tracker and open it', () => {
    view.getAddNewModalSave().click();

    waitForUrlContains('trackers/');
    expectUrlToContain('trackers/');
  });

  it('should render tracker name correctly', () => {
    browser.sleep(1000);
    expect(view.getEntityNameHeaderSolo().getText()).toEqual('e2e test tracker');
  });

  it('should render correct number of tab labels', () => {
    expect(view.getTabLabels().count()).toEqual(3);
  });

  it('should update tracker name', () => {
    view.getFirstCardMenuButton().click();
    browser.sleep(200);
    view.getAssociationButton().click();
    view.gitFirstCardInputs().first().sendKeys(' updated');
    view.getAddNewModalSave().click();
    browser.sleep(1000);
    expect(view.getEntityNameHeaderSolo().getText()).toEqual('e2e test tracker updated');
  });

});
