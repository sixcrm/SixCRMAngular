import {by, element} from 'protractor';

export class EntityIndexPage {

  getComponent() {
    return element(by.css('.entity-index'))
  }

  getAddButton() {
    return element(by.css('.entity-index__add'));
  }

  getTitle() {
    return element(by.css('.entity-index__title'));
  }

  getTableHeaders() {
    return element.all(by.css('th'));
  }

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
