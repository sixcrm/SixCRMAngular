import {by, element} from 'protractor';

export class ReportIndexPage {

  getComponent() {
    return element(by.css('.entity-index'))
  }

  getAddButton() {
    return element(by.css('.entity-index__add'));
  }

  getTitle() {
    return element(by.css('.title'));
  }

  getTableHeaders() {
    return element(by.css('.floating-header')).all(by.css('.head'));
  }

  getQuickFilters() {
    return element.all(by.css('.tabs__item'));
  }

  getQuickFilterCounter(num: number) {
    return element.all(by.css('.tabs__item')).get(num).element(by.css('.counter')).element(by.css('span'));
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

  getLink(row: number, cell: number) {
    return this.getTableRow(row).all(by.css('td')).get(cell).element(by.css('a'));
  }

  getOpenFilterButton() {
    return element(by.css('.toolbar')).element(by.css('.options')).element(by.css('div'));
  }

  getFilterValuesSection(num: number) {
    return element(by.css('order-filters-dialog')).all(by.css('.filter')).get(num);
  }

  getFirstValueInputOfFilterValuesSection(num: number) {
    return this.getFilterValuesSection(num).all(by.css('input')).get(0);
  }

  getFiltersDialog() {
    return element(by.css('.filters-dialog'));
  }

  getLoader() {
    return element(by.css('.loader'));
  }

  getFilterButton() {
    return this.getFiltersDialog().element(by.css('.buttons-container')).all(by.css('button')).last();
  }

  getBackButton() {
    return element(by.css('.details')).element(by.css('.back'));
  }
}
