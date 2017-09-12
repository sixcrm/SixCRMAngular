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
    return element(by.css('customer-add-new')).element(by.css('.button-container'))
  }
}
