import {EntityIndexPage} from '../po/entity-index.po';
import {login} from '../utils/action.utils';
import {waitForUrlContains, waitForNotPresenceOf, waitForPresenceOf} from '../utils/navigation.utils';
import {expectDefined} from '../utils/assertation.utils';
import {SidenavPage} from '../po/sidenav.po';
import {browser} from 'protractor';
import {AppPage} from '../po/app.po';

describe('Customers', function() {
  let page: EntityIndexPage;

  beforeEach(() => {
    page = new EntityIndexPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    login();
    waitForUrlContains('dashboard');

    new SidenavPage().getLink(8).click();
    waitForUrlContains('customers');
  });

  it('should render customers index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render customers index title', () => {
    expect(page.getTitle().getText()).toContain('Customers')
  });

  it('should render customers index button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render customers index table headers', () => {
    expect(page.getTableHeaders().get(0).getText()).toEqual('First Name');
    expect(page.getTableHeaders().get(1).getText()).toEqual('Last Name');
    expect(page.getTableHeaders().get(2).getText()).toEqual('State');
    expect(page.getTableHeaders().get(3).getText()).toEqual('City');
  });

  it('should open add new customer form when click on button', () => {
    page.getAddButton().click();
    waitForUrlContains('customers/add');

    expectDefined(page.getNewCustomerForm());
    expect(page.getNewCustomerInputs().count()).toEqual(9);
  });

  it('should add new customer', () => {
    const appPage = new AppPage();
    waitForNotPresenceOf(appPage.getProgressBar());

    const customerName = 'Customer Test fn';
    const customerLastname = 'Customer Test ln';

    page.getNewCustomerInputs().get(0).sendKeys(customerName);
    page.getNewCustomerInputs().get(1).sendKeys(customerLastname);
    page.getNewCustomerInputs().get(2).sendKeys('123456789');
    page.getNewCustomerInputs().get(3).sendKeys('testcustomer@example.com');
    page.getNewCustomerInputs().get(4).sendKeys('test customer address');
    page.getNewCustomerInputs().get(5).sendKeys('test customer city');
    page.getNewCustomerInputs().get(6).sendKeys('a');
    browser.sleep(200);
    page.getFirstOption().click();
    page.getNewCustomerInputs().get(7).sendKeys('21000');
    page.getNewCustomerInputs().get(8).sendKeys('u');
    browser.sleep(200);
    page.getFirstOption().click();

    browser.sleep(200);

    page.getNewCustomerSaveButton().click();
    waitForPresenceOf(page.getCustomerName());
    expect(page.getCustomerName().getText()).toEqual(`${customerName} ${customerLastname}`)
  });
});
