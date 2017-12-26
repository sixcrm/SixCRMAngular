import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {ProductSchedulePage} from '../po/product-schedule.po';
import {LoadBalancerPage} from '../po/load-balancer.po';
import {EntityViewPage} from '../po/entity-view.po';

describe('Load Balancer', function() {
  let page: EntityIndexPage;
  let loadBalancer: LoadBalancerPage;
  let view: EntityViewPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    loadBalancer = new LoadBalancerPage();
    view = new EntityViewPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should navigate to loadbalancer page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(26).click();
    browser.sleep(500);
    sidenav.getLink(28).click();
    waitForUrlContains('loadbalancer');
    expectUrlToContain('loadbalancer');
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
    expectDefined(loadBalancer.getNewForm());
  });

  it('should show errors when try to submit empty form', () => {
    loadBalancer.getNewFormSaveButton().click();
    expect(loadBalancer.getErrorInputs().count()).toBeGreaterThan(1);
  });

  it('should remove errors when form is valid', () => {
    loadBalancer.getNewFormInputs().get(0).sendKeys('e2e load balancer');
    expect(loadBalancer.getErrorInputs().count()).toEqual(0);
  });

  it('should create new product schedule and redirect product schedule view', () => {
    loadBalancer.getNewFormSaveButton().click();
    waitForUrlContains('loadbalancers/');
    expectUrlToContain('loadbalancers/');
  });

  it('should display product schedule details', () => {
    browser.sleep(2000);
    expect(loadBalancer.getLoadBalancerName().getText()).toEqual('e2e load balancer');
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
