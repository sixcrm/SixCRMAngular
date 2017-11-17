import {waitForUrlContains, clearLocalStorage} from '../utils/navigation.utils';
import {ProfilePage} from '../po/profile.po';
import {TopnavPage} from '../po/topnav.po';
import {login} from '../utils/action.utils';
import {browser} from 'protractor';
import {expectUrlToContain} from '../utils/assertation.utils';
import {NotificationsQuickPage} from '../po/notifications-quick.po';

describe('App load', function() {
  let profilePage: ProfilePage;
  let topnavPage: TopnavPage;
  let notificationsPage: NotificationsQuickPage;

  beforeEach(() => {
    profilePage = new ProfilePage();
    topnavPage = new TopnavPage();
    notificationsPage = new NotificationsQuickPage();
  });

  beforeAll(() => {
    browser.driver.manage().window().setSize(1440, 900);

    clearLocalStorage();
    login();
    waitForUrlContains('dashboard');
  });

  it('should navigate to profile/user settings page', () => {
    topnavPage.getProfileMenuButton().click();
    browser.sleep(200);

    topnavPage.getUserSettingsMenuOption().click();

    waitForUrlContains('profile');
    browser.sleep(500);
    expectUrlToContain('profile');
  });

  it('should update username', () => {
    profilePage.getUsernameInput().sendKeys('1');
    profilePage.getUpdateButton().click();
  });


  it('should open notifications tab', () => {
    profilePage.getNotificationsTabButton().click();
    browser.sleep(500);

    expect(profilePage.getSendTestNotificationButton()).toBeDefined();
    expect(profilePage.getSendTestAlertButton()).toBeDefined();
  });

  it('should reset notifications counter', () => {
    notificationsPage.getOpenNotificationsButton().click();
    browser.sleep(1000);
  });

  it('should send test notifications', () => {
    profilePage.getSendTestNotificationButton().click();
    browser.sleep(2000);

    expect(notificationsPage.getNotificationCounter().getText()).toEqual('1');
  });

  it('should send test alert', () => {
    profilePage.getSendTestAlertButton().click();
    browser.sleep(2000);

    expect(notificationsPage.getAlerts().count()).toEqual(1);
  });

  it('should dismiss test alert', () => {
    notificationsPage.getFirstAlertDismissButton().click();
    browser.sleep(2000);

    expect(notificationsPage.getAlerts().count()).toEqual(0);
  });
});
