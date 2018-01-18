import {EntityIndexPage} from '../../po/entity-index.po';
import {SearchPage} from '../../po/search.po';
import {browser, protractor} from 'protractor';
import {clearLocalStorage, waitForUrlContains, waitForPresenceOf} from '../../utils/navigation.utils';
import {login} from '../../utils/action.utils';
import {SidenavPage} from '../../po/sidenav.po';
import {expectUrlToContain} from '../../utils/assertation.utils';
import {generateLetters} from '../../utils/generator.utils';
import {TopnavPage} from '../../po/topnav.po';
import {EntityViewPage} from '../../po/entity-view.po';

describe('AffiliateSearchCycle', function() {
  let page: EntityIndexPage;
  let affiliatePage: EntityViewPage;
  let searchPage: SearchPage;
  let sidenav: SidenavPage;
  let topnav: TopnavPage;

  const affiliateName = generateLetters(12);

  beforeEach(() => {
    page = new EntityIndexPage();
    affiliatePage = new EntityViewPage();
    searchPage = new SearchPage();
    sidenav = new SidenavPage();
    topnav = new TopnavPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should create new affiliate', () => {
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(17).click();
    waitForUrlContains('affiliates');

    page.getAddButton().click();

    affiliatePage.getAddNewModalInputs().first().sendKeys(affiliateName);

    affiliatePage.getAddNewModalSave().click();

    browser.sleep(1500);
    expect(affiliatePage.getEntityNameHeader().getText()).toEqual(affiliateName);
  });

  it('wait for 90 seconds and perform search', () => {
    browser.sleep(90000);

    topnav.getSearchButton().click();
    browser.sleep(300);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(affiliateName);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('search');
    expectUrlToContain('search');
  });

  it('should find newly created affiliate when search by affiliate name', () => {
    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should open product schedule view when clicked on search result', () => {
    searchPage.getOneSearchResult().click();

    browser.sleep(2000);

    waitForUrlContains('affiliates');
    expectUrlToContain('affiliates');

    expect(affiliatePage.getEntityNameHeader().getText()).toEqual(affiliateName);

  })

});
