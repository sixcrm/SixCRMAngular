import {element, by} from 'protractor';

export class ProductPage {
  getNewProductForm() {
    return element(by.css('product-add-new'));
  }

  getNewProductInputs() {
    return element(by.css('product-add-new')).all(by.css('input'));
  }

  getNewProductSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getErrorInputs() {
    return element(by.css('product-add-new')).all(by.css('.ng-invalid'));
  }

  getProductName() {
    return element(by.css('.entity-view__info__data__name'));
  }

  getDetailsMenuButton() {
    return element(by.css('.entity-view__card__header')).element(by.css('mat-icon'));
  }

  getMenuButton(index: number) {
    return element(by.css('.mat-menu-content')).all(by.css('button')).get(index);
  }

  getProductFromTable(index) {
    return element(by.css('tbody')).all(by.css('tr')).get(index).element(by.css('td'));
  }
}
