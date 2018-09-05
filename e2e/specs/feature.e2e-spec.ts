import {waitForUrlContains, clearLocalStorage, waitForPresenceOf, clearAuth0SSO} from '../utils/navigation.utils';
import {tosCheck, customLogin} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectPresent, expectNotPresent} from '../utils/assertation.utils';
import {FeaturePage} from '../po/feature.po';
import {TopnavPage} from '../po/topnav.po';
import {NavPage} from '../po/nav.po';
import {generateString} from '../utils/generator.utils';

describe('Feature', function() {
  let featurePage: FeaturePage;
  let topnav: TopnavPage;

  beforeEach(() => {
    featurePage = new FeaturePage();
    topnav = new TopnavPage();
  });

  beforeAll((done) => {
    browser.driver.manage().window().setSize(1440, 900);

    browser.get('/');
    clearLocalStorage();
    customLogin('e2e-create-order@sixcrm.com', '123456789');
    waitForUrlContains('dashboard');
    tosCheck(done);
  });

  afterAll(() => {
    clearLocalStorage();
    clearAuth0SSO();
  });

  it('should open create order modal', () => {
    topnav.getAddButton().click();
    topnav.getDropdownOptions().first().click();

    expectPresent(createOrderPage.getCreateOrderModalContainer());
  });

});
