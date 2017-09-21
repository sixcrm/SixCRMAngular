import {element, by} from 'protractor';

export class CustomerPage {
  getNewCustomerForm() {
    return element(by.css('customer-add-new'));
  }

  getNewCustomerInputs() {
    return element(by.css('customer-add-new')).all(by.css('input'));
  }

  getCustomerName() {
    return element(by.css('.entity-view__info__data__name'));
  }

  getFirstOption() {
    return element(by.css('.default-autocomplete-input__options__item'));
  }

  getNewCustomerSaveButton() {
    return element(by.css('.entity-view__card__actions')).element(by.css('div'))
  }

  getCustomerFromTable(index) {
    return element(by.css('tbody')).all(by.css('tr')).get(index).element(by.css('td'));
  }

  getCustomerUpdateButton() {
    return element(by.css('.entity-view__info__edit__update'));
  }

  getCustomerNameInput() {
    return element(by.css('.entity-view__info__data__name')).all(by.css('input')).first();
  }

  getCustomerLastNameInput() {
    return element(by.css('.entity-view__info__data__name')).all(by.css('input')).last();
  }

  getCustomerFullName() {
    return element(by.css('.entity-view__info__data__name'));
  }

  getCustomerNotesMenu() {
    return element(by.css('customer-notes')).element(by.css('md-card-title')).element(by.css('md-icon'));
  }

  getAddNewNoteButton() {
    return element(by.css('.md-menu-content')).element(by.css('button'));
  }

  getNoteTextArea() {
    return element(by.css('textarea'));
  }

  getConfirmNoteButton() {
    return element(by.css('.notes__new__actions__done'));
  }

  getFirstNoteText() {
    return element(by.css('.note__content')).element(by.css('span'));
  }
}
