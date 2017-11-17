import {element, by} from 'protractor';

export class ProfilePage {

  getUsernameInput() {
    return element(by.css('.profile-page__content__general__data')).all(by.css('input')).first();
  }

  getUpdateButton() {
    return element(by.css('.profile-page__content__general__button'));
  }

  getNotificationsTabButton() {
    return element.all(by.css('.entity-view__navigation__label')).get(1);
  }

  getAccountsTabButton() {
    return element.all(by.css('.entity-view__navigation__label')).get(2);
  }

  getFirstAccount() {
    return element(by.css('td'));
  }

  getSendTestNotificationButton() {
    return element.all(by.css('.card-outside-button')).first();
  }

  getSendTestAlertButton() {
    return element.all(by.css('.card-outside-button')).last();
  }
}
