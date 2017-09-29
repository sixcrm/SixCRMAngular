import {element, by} from 'protractor';

export class NotificationsQuickPage {

  getNotificationCounter() {
    return element(by.css('.topnav__notifications__count')).element(by.css('span'));
  }

  getOpenNotificationsButton() {
    return element(by.css('.topnav__notifications'));
  }

  getNotificationsList() {
    return element(by.css('.notifications-list'));
  }

}
