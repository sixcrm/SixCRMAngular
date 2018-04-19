import {element, by} from 'protractor';

export class ProductSchedulePage {

  getNewProductScheduleForm() {
    return element(by.css('product-schedule-add-new'));
  }

  getNewProductScheduleInputs() {
    return element(by.css('product-schedule-add-new')).all(by.css('.mat-input-element'));
  }

  getNewProductScheduleSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getErrorInputs() {
    return element(by.css('product-schedule-add-new')).all(by.css('.ng-invalid'));
  }

  getProductScheduleName() {
    return element(by.css('.entity-view__header__title'));
  }

  getDetailsMenuButton() {
    return element(by.css('.entity-view__card__header')).element(by.css('mat-icon'));
  }

  getMenuButton(index: number) {
    return element(by.css('.mat-menu-content')).all(by.css('button')).get(index);
  }

  getAutoCompleteOption() {
    return element(by.css('.default-autocomplete-input__options__item'));
  }

  getAddScheduleInputs() {
    return element(by.css('add-schedule')).all(by.css('input'));
  }

  getAddScheduleAddButton() {
    return element(by.css('add-schedule')).all(by.css('.entity-view__card__actions')).all(by.css('div')).get(1);
  }

  getAssociatedSchedulesRows() {
    return element(by.css('tbody')).all(by.css('tr'));
  }

  getTableRowOptionsButton() {
    return element(by.css('tbody')).element(by.css('tr')).element(by.css('mat-icon'));
  }

  getConfirmDeleteButton() {
    return element(by.css('delete-dialog')).element(by.css('mat-card-actions')).all(by.css('div')).last();
  }
  getProductScheduleSubnav(){
    return element(by.css('.entity-view__navigation')).all(by.css('span'));
  }

  getAddProductToScheduleButton(){
    return element(by.css('.header')).element(by.css('.mat-icon'));
  }
  getNewProductInput(){
    return element(by.css('autocomplete-input')).element(by.css('input'));
  }
  getSaveProductToScheduleButton(){
    return element(by.css('.section--dropdown')).element(by.css('mat-icon'));
  }

  getProductIsScheduledName(){
    return element(by.css('.products-list')).all(by.css('.text')).last();
  }
}
