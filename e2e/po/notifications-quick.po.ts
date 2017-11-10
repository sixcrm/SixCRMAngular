import {element, by} from 'protractor';

export class NotificationsQuickPage {

  getNotificationCounter() {
    return element(by.css('.topnav__notifications__count'));
  }

  getOpenNotificationsButton() {
    return element(by.css('.topnav__notifications'));
  }

  getNotificationsList() {
    return element(by.css('.notifications-list'));
  }

  getAlerts() {
    return element.all(by.css('alert-component'));
  }

  getFirstAlertDismissButton() {
    return element(by.css('alert-component')).element(by.css('.dismiss'));
  }
}
