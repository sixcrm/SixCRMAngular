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

  getSSTableCells() {
    return element.all(by.css('table.table__custom td'));
  }

  getSSFirstRowMenuButton() {
    return this.getSSTableCells().get(3).element(by.css('mat-icon'));
  }

  getSSEditButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Edit'));
  }

  getSSRemoveButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Remove'));
  }

  getSSMenuButton() {
    return element(by.css('.entity-view__table-component__header__action'));
  }

  getSSAddButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Add new Signing String'));
  }

  getSSDialogNameInput() {
    return element(by.css('single-input-dialog input'));
  }

  getSSDialogSaveButton() {
    return element(by.cssContainingText('single-input-dialog .custom-dialog__buttons div', 'Save'));
  }

  getSSDialogDeleteButton() {
    return element(by.cssContainingText('.custom-dialog__buttons div', 'DELETE'));
  }
}
