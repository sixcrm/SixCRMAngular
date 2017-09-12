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

}
