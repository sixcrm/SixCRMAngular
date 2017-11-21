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

  getTableRows() {
    return element(by.css('tbody')).all(by.css('tr'));
  }

  getTableRow(row: number) {
    return element(by.css('tbody')).all(by.css('tr')).get(row);
  }

  getCell(row: number, cell: number) {
    return this.getTableRow(row).all(by.css('td')).get(cell);
  }

}
