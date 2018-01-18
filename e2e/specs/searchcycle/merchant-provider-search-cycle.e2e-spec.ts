import {EntityIndexPage} from '../../po/entity-index.po';
import {SearchPage} from '../../po/search.po';
import {browser, protractor} from 'protractor';
import {clearLocalStorage, waitForUrlContains, waitForPresenceOf} from '../../utils/navigation.utils';
import {login} from '../../utils/action.utils';
import {SidenavPage} from '../../po/sidenav.po';
import {expectUrlToContain} from '../../utils/assertation.utils';
import {generateLetters} from '../../utils/generator.utils';
import {TopnavPage} from '../../po/topnav.po';
import {MerchantProviderPage} from '../../po/merchant-provider.po';
import {EntityViewPage} from '../../po/entity-view.po';

describe('MerchantProviderSearchCycle', function() {
  let page: EntityIndexPage;
  let merchantProvider: MerchantProviderPage;
  let searchPage: SearchPage;
  let sidenav: SidenavPage;
  let topnav: TopnavPage;
  let view: EntityViewPage;

  const merchantProviderName = generateLetters(12);

  beforeEach(() => {
    page = new EntityIndexPage();
    merchantProvider = new MerchantProviderPage();
    searchPage = new SearchPage();
    sidenav = new SidenavPage();
    topnav = new TopnavPage();
    view = new EntityViewPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should create new merchant provider', () => {
    sidenav.getLink(26).click();
    browser.sleep(500);
    sidenav.getLink(27).click();
    waitForUrlContains('merchantproviders');

    page.getAddButton().click();

    merchantProvider.getNewFormInput(0).sendKeys(merchantProviderName);
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

    browser.sleep(200);

    merchantProvider.getNewFormSaveButton().click();

    browser.sleep(1500);
    expect(view.getEntityNameHeader().getText()).toEqual(merchantProviderName);

  });

  it('wait for 90 seconds and perform search', () => {
    browser.sleep(90000);

    topnav.getSearchButton().click();
    browser.sleep(300);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(merchantProviderName);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('search');
    expectUrlToContain('search');
  });

  it('should find newly created merchant provider when search by merchant provider name', () => {
    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should open merchant provider view when clicked on search result', () => {
    searchPage.getOneSearchResult().click();

    browser.sleep(2000);

    waitForUrlContains('merchantproviders');
    expectUrlToContain('merchantproviders');

    expect(view.getEntityNameHeader().getText()).toEqual(merchantProviderName);
  })

});
