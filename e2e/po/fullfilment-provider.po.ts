import {element, by} from 'protractor';

export class FulfillmentProviderPage {

  getCopyIcon() {
    return element(by.css('.fulfillment-view__validation')).element(by.css('mat-icon'));
  }

  getValidationResponse() {
    return element(by.css('.validation__explanation--message'));
  }

  getProviderTypeDropdown() {
    return element(by.css('fulfillment-provider-add-new')).element(by.css('.dropdown-component'));
  }

  getDropdownItem(num: number) {
    return element(by.css('fulfillment-provider-add-new')).all(by.css('.dropdown-component__options__item')).get(num);
  }

}
