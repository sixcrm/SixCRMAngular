import {EntityIndexPage} from '../po/entity-index.po';
import {login} from '../utils/action.utils';
import {waitForUrlContains, waitForNotPresenceOf, waitForPresenceOf} from '../utils/navigation.utils';
import {expectDefined, expectUrlToContain} from '../utils/assertation.utils';
import {SidenavPage} from '../po/sidenav.po';
import {browser} from 'protractor';
import {AppPage} from '../po/app.po';
import {CustomerPage} from '../po/customer.po';
import {generateUUID} from '../../src/app/shared/utils/queries/entities/entities-helper.queries';

describe('Customers', function() {
  let page: EntityIndexPage;
  let customerPage: CustomerPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    customerPage = new CustomerPage();
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

    expectDefined(customerPage.getNewCustomerForm());
    expect(customerPage.getNewCustomerInputs().count()).toEqual(9);
  });

  it('should add new customer', () => {
    const appPage = new AppPage();
    waitForNotPresenceOf(appPage.getProgressBar());

    const customerName = 'Customer Test fn';
    const customerLastname = 'Customer Test ln';

    customerPage.getNewCustomerInputs().get(0).sendKeys(customerName);
    customerPage.getNewCustomerInputs().get(1).sendKeys(customerLastname);
    customerPage.getNewCustomerInputs().get(2).sendKeys('123456789');
    customerPage.getNewCustomerInputs().get(3).sendKeys('testcustomer@example.com');
    customerPage.getNewCustomerInputs().get(4).sendKeys('test customer address');
    customerPage.getNewCustomerInputs().get(5).sendKeys('test customer city');
    customerPage.getNewCustomerInputs().get(6).sendKeys('a');
    browser.sleep(200);
    customerPage.getFirstOption().click();
    customerPage.getNewCustomerInputs().get(7).sendKeys('21000');
    customerPage.getNewCustomerInputs().get(8).sendKeys('u');
    browser.sleep(200);
    customerPage.getFirstOption().click();

    browser.sleep(200);

    customerPage.getNewCustomerSaveButton().click();
    waitForPresenceOf(customerPage.getCustomerName());
    expect(customerPage.getCustomerName().getText()).toEqual(`${customerName} ${customerLastname}`)
  });

  it('should open customer view customer', () => {
    new SidenavPage().getLink(8).click();
    waitForUrlContains('customers');

    browser.sleep(500);

    customerPage.getCustomerFromTable(0).click();
    waitForPresenceOf(customerPage.getCustomerName());
    expectUrlToContain('customers/');
  });

  it('should update customer', () => {
    customerPage.getCustomerUpdateButton().click();
    browser.sleep(100);

    const firstNameSuffix = generateUUID().substring(0,2);
    const lastNameSuffix = generateUUID().substring(0,2);

    customerPage.getCustomerNameInput().sendKeys(firstNameSuffix);
    customerPage.getCustomerLastNameInput().sendKeys(lastNameSuffix);

    customerPage.getCustomerUpdateButton().click();
    browser.sleep(1000);

    expect(customerPage.getCustomerFullName().getText()).toContain(firstNameSuffix);
    expect(customerPage.getCustomerFullName().getText()).toContain(lastNameSuffix);
  });

  it('should add new note', () => {
    const noteText = 'new note text ' + generateUUID();

    customerPage.getCustomerNotesMenu().click();
    browser.sleep(500);
    customerPage.getAddNewNoteButton().click();
    browser.sleep(200);

    customerPage.getNoteTextArea().sendKeys(noteText);
    customerPage.getConfirmNoteButton().click();
    browser.sleep(1000);

    expect(customerPage.getFirstNoteText().getText()).toEqual(noteText);
  })
});
