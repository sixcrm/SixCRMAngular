import {element, by} from 'protractor';

export class AccountPage {

  getAssociatedUsers() {
    return element.all(by.css('tr'))
  }

  getLastUserButton() {
    return element.all(by.css('tr')).last().element(by.css('md-icon'));
  }

  getRemoveUserButton() {
    return element(by.css('.md-menu-content')).all(by.css('button')).last();
  }

  getConfirmDeleteButton() {
    return element(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }

  getTabs() {
    return element.all(by.css('.entity-view__navigation__label'));
  }

  getAccessKeysOptionsButton() {
    return element(by.css('access-keys')).element(by.css('.entity-view__table-component__header__action'));
  }

  getAccessKeysRows() {
    return element(by.css('access-keys')).element(by.css('tbody')).all(by.css('tr'));
  }

  getLastAccessKeysButton() {
    return element(by.css('access-keys')).element(by.css('tbody')).all(by.css('tr')).last().element(by.css('md-icon'));
  }
}
