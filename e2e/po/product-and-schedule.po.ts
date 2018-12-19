import {by, element} from 'protractor';

export class ProductAndScheduleIndexPage {

  getComponent() {
    return element(by.css('.grid-body'))
  }

  getAddButton() {
    return this.getComponent().element(by.css('.add-new-button'));
  }

  getFilterInput() {
    return this.getComponent().element(by.css('.mrw-bi-input')).element(by.css('input'));
  }

  getBulkSelector() {
    return element(by.css('.bulk-actions'));
  }

  getBulkOptions() {
    return this.getBulkSelector().element(by.css('.options__selected'));
  }

  getBulkSelectAllOption() {
    return element.all(by.css('.mat-menu-item')).get(1);
  }

  getBulkDeselectAllOption() {
    return element.all(by.css('.mat-menu-item')).get(2);
  }

  getBulkCopyOption() {
    return element.all(by.css('.mat-menu-item')).get(0);
  }

  getBulkApply() {
    return this.getBulkSelector().all(by.css('button')).last();
  }

  getBulkDeleteOption() {
    return element.all(by.css('.mat-menu-item')).get(3);
  }

  getConfirmDeleteButton() {
    return element(by.css('.delete-dialog-container')).all(by.css('button')).last();
  }

  getAllSelectedCard() {
    return element.all(by.css('.entity-card--selected'));
  }

  getCards() {
    return this.getComponent().all(by.css('.entity-card'))
  }

  getCardAt(index: number) {
    return this.getCards().get(index);
  }

  getBreadcrumbs() {
    return element(by.css('.crumbs')).all(by.css('.item'));
  }

  getBreadcrumbAt(index: number) {
    return this.getBreadcrumbs().get(index);
  }

  getShowFilter() {
    return element.all(by.css('.sort')).last();
  }

  getShowAllItem() {
    return element.all(by.css('.mat-menu-item')).get(0);
  }

  getShowProductsItem() {
    return element.all(by.css('.mat-menu-item')).get(1);
  }

  getShowSchedulesItem() {
    return element.all(by.css('.mat-menu-item')).get(2);
  }
}
