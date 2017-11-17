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

}
