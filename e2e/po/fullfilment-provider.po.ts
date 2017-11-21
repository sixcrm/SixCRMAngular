import {element, by} from 'protractor';

export class FulfillmentProviderPage {

  getCopyIcon() {
    return element(by.css('.fulfillment-view__validation')).element(by.css('md-icon'));
  }

  getValidationResponse() {
    return element(by.css('.validation__explanation--message'));
  }

}
