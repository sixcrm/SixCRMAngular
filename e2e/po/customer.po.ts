import { element, by, ElementFinder } from 'protractor';

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
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
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
    return element(by.css('customer-notes')).element(by.css('mat-card-title')).element(by.css('md-icon'));
  }

  getFirstMenuButton() {
    return element(by.css('.md-menu-content')).element(by.css('button'));
  }

  getNoteTextArea() {
    return element(by.css('textarea'));
  }

  getConfirmNoteButton() {
    return element(by.css('.notes__new__actions__done'));
  }

  getNotes() {
    return element.all(by.css('.note__content'));
  }

  getFirstNoteText() {
    return element(by.css('.note__content')).element(by.css('span'));
  }

  getFirstNoteMenuButton() {
    return element(by.css('.note__content')).element(by.css('md-icon'));
  }

  getConfirmDeleteButton() {
    return element(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }

  getBillingMenuButton() {
    return element.all(by.css('.customer-view__card')).get(1).element(by.css('md-icon'));
  }

  getBillingAddCardButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Add Credit Card'));
  }

  getBillingEditCardButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Edit Credit Card'));
  }

  getBillingInputs() {
    return element.all(by.css('.customer-view__edit input'));
  }

  getBillingSelects() {
    return element.all(by.css('.customer-view__edit .dropdown-component__text'));
  }

  getBillingSaveButton() {
    return element(by.cssContainingText('.customer-view__edit__actions div', 'Save'));
  }

  getBillingUpdateButton() {
    return element(by.cssContainingText('.customer-view__edit__actions div', 'Update'));
  }

  getBillingCardInputs() {
    return element.all(by.css('.customer-view__card')).get(1).all(by.css('input'));
  }

  getBillingCardMenuButtons() {
    return element.all(by.css('.credit-cards__item md-icon'));
  }

  getBillingRemoveCardButton() {
    return element(by.cssContainingText('button[role="menuitem"]', 'Remove Credit Card'));
  }

  getSelectOptions(select: ElementFinder) {
    return select
      .element(by.xpath('following-sibling::div'))
      .all(by.css('.dropdown-component__options__item'));
  }
}
