import {waitForUrlContains, clearLocalStorage, waitForPresenceOf} from '../utils/navigation.utils';
import {EntityIndexPage} from '../po/entity-index.po';
import {SidenavPage} from '../po/sidenav.po';
import {login, tosCheck} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain, expectDefined} from '../utils/assertation.utils';
import {CampaignPage} from '../po/campaign.po';

describe('Campaigns', function() {
  let page: EntityIndexPage;
  let campaignPage: CampaignPage;

  beforeEach(() => {
    page = new EntityIndexPage();
    campaignPage = new CampaignPage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    browser.restart();
  });

  it('should navigate to campaigns page', () => {
    const sidenav = new SidenavPage();
    sidenav.getLink(12).click();
    browser.sleep(500);
    sidenav.getLink(13).click();
    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should render campaigns index component', () => {
    expectDefined(page.getComponent());
  });

  it('should render campaigns index title', () => {
    browser.sleep(1200);
    expect(page.getTitle().getText()).toContain('Campaigns');
  });

  it('should render campaigns index add button', () => {
    expectDefined(page.getAddButton());
  });

  it('should render add modal when add button is clicked', () => {
    page.getAddButton().click();

    expectDefined(campaignPage.getNewCampaignForm());
  });

  it('should show error when try to save without name', () => {
    campaignPage.getCampaignFormSaveButton().click();

    expect(campaignPage.getNewCampaignFormInvalidInputs().count()).toBeGreaterThan(0);
  });

  it('should remove error when proper name is entered', () => {
    browser.sleep(1200);
    campaignPage.getNewCampaignFormNameInput().sendKeys('e2e test campaign');
    browser.sleep(200);
    expect(campaignPage.getNewCampaignFormInvalidInputs().count()).toBe(0);
  });

  it('should save campaign', () => {
    browser.sleep(1200);
    campaignPage.getCampaignFormSaveButton().click();
    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it('should go to an individual campaign and open it', () => {
    browser.sleep(1200);
    campaignPage.getCampaignIndividualCampaign().get(0).click();
    waitForUrlContains('campaigns/');
    expectUrlToContain('campaigns/');
  });

  it('should render campaign name correctly', () => {
    browser.sleep(1200);
    expect(campaignPage.getCampaignNameInHeader().getText()).toContain('e2e test campaign');
  });

  it('should update campaign name', () => {
    browser.sleep(1200);
    campaignPage.getMenuButton().click();
    browser.sleep(200);
    campaignPage.getEditButton().click();
    browser.sleep(200);
    campaignPage.getCampaignNameInCard().sendKeys(' updated');
    campaignPage.getCampaignFormSaveButton().click();
    browser.sleep(1200);
    expect(campaignPage.getCampaignNameInHeader().getText()).toEqual('e2e test campaign updated');
  });

  it( 'should go back to campaign index', () =>  {
    campaignPage.getCampaignIndexButton().click();
    browser.sleep(500);
    waitForUrlContains('campaigns');
    expectUrlToContain('campaigns');
  });

  it( 'should delete the campaign', () => {
    browser.sleep(2000);
    campaignPage.getCampaignDeleteButton().click();
    browser.sleep(200);
    campaignPage.getCampaignDeleteModalButton().click();
    waitForPresenceOf(page.getSuccessSnackbar());
    expect(page.getSuccessSnackbar().getText()).toEqual('Deleted Successfully!')
  });

});
