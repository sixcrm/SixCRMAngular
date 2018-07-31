import {EntityIndexPage} from '../../po/entity-index.po';
import {SearchPage} from '../../po/search.po';
import {browser, protractor} from 'protractor';
import {clearLocalStorage, waitForUrlContains, waitForPresenceOf} from '../../utils/navigation.utils';
import {login} from '../../utils/action.utils';
import {NavPage} from '../../po/sidenav.po';
import {expectUrlToContain} from '../../utils/assertation.utils';
import {generateLetters} from '../../utils/generator.utils';
import {TopnavPage} from '../../po/topnav.po';
import {CampaignPage} from '../../po/campaign.po';

describe('CampaignSearchCycle', function() {
  let page: EntityIndexPage;
  let campaignPage: CampaignPage;
  let searchPage: SearchPage;
  let sidenav: NavPage;
  let topnav: TopnavPage;

  const campaignName = generateLetters(12);

  beforeEach(() => {
    page = new EntityIndexPage();
    campaignPage = new CampaignPage();
    searchPage = new SearchPage();
    sidenav = new NavPage();
    topnav = new TopnavPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should create new product', () => {
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(15).click();
    waitForUrlContains('campaigns');

    page.getAddButton().click();

    campaignPage.getNewCampaignFormNameInput().sendKeys(campaignName);

    browser.sleep(200);

    campaignPage.getCampaignFormSaveButton().click();

    browser.sleep(1500);
    expect(campaignPage.getCampaignNameInHeader().getText()).toEqual(campaignName);
  });

  it('wait for 90 seconds and perform search', () => {
    browser.sleep(90000);

    topnav.getSearchButton().click();
    browser.sleep(300);
    waitForPresenceOf(topnav.getSearchInput());
    topnav.getSearchInput().sendKeys(campaignName);
    topnav.getSearchInput().sendKeys(protractor.Key.ENTER);

    waitForUrlContains('search');
    expectUrlToContain('search');
  });

  it('should find newly created campaign when search by campaign name', () => {
    browser.sleep(1000);

    waitForPresenceOf(searchPage.getOneSearchResult());
    waitForPresenceOf(searchPage.getOneCheckbox());

    expect(searchPage.getResults().count()).toBeGreaterThan(0);
    expect(searchPage.getCheckboxes().count()).toBeGreaterThan(0);
  });

  it('should open campaign view when clicked on search result', () => {
    searchPage.getOneSearchResult().click();

    browser.sleep(2000);

    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');

    expect(campaignPage.getCampaignNameInHeader().getText()).toEqual(campaignName);
  })

});
