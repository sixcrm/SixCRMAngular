import {by, element} from 'protractor';

export class AdvancedFilterPage {

  getComponent() {
    return element(by.css('.advanced-filter'));
  }
}
