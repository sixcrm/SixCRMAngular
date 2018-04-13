import {element, by} from 'protractor';

export class AccountPage {

  getAssociatedUsers() {
    return element.all(by.css('tr'))
  }

  getLastUserButton() {
    return element.all(by.css('tr')).last().element(by.css('mat-icon'));
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
    return element(by.css('access-keys')).element(by.css('tbody')).all(by.css('tr')).last().element(by.css('mat-icon'));
  }

  getAKTableHeaderCells() {
    return element.all(by.css('table.highlight.table__custom th'));
  }

  getAKTableCells() {
    return element.all(by.css('table.highlight.table__custom td'));
  }

  getAKFirstRowMenuButton() {
    return this.getAKTableCells().get(4).element(by.css('mat-icon'));
  }

  getAKEditButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Edit Access Keys'));
  }

  getAKRemoveButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Remove Access Keys'));
  }

  getAKMenuButton() {
    return element(by.css('.entity-view__table-component__header__action'));
  }

  getAKAddButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Add Access Keys'));
  }

  getAKDialogNameInput() {
    return element(by.css('access-key-details-dialog input'));
  }

  getAKDialogNoteTextarea() {
    return element(by.css('access-key-details-dialog textarea'));
  }

  getAKDialogUpdateButton() {
    return element(by.cssContainingText('access-key-details-dialog .access-key-details-actions div', 'UPDATE'));
  }

  getAKDialogDeleteButton() {
    return element(by.cssContainingText('.custom-dialog__buttons div', 'DELETE'));
  }
}
