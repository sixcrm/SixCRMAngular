import {element, by} from 'protractor';

export class ProductPage {

  getNewProductInputs() {
    return element(by.css('product-add-new')).all(by.css('input'));
  }

  getNewProductSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getProductName() {
    return element(by.css('.title'));
  }


  getProductNameInput() {
    return element(by.css('.details-box--blue')).all(by.css('input')).first();
  }

  getSaveProductGeneralButton() {
    return element(by.css('.edit-buttons')).all(by.css('button')).last();
  }

  getCreateScheduleButton() {
    return element(by.css('.action-buttons')).all(by.css('button')).first();
  }
}
