import {element, by} from 'protractor';
import {all} from 'q';

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
    // return element(by.css('schedule-detailed-list')).element(by.css('mat-icon'));
    return element(by.css('.list__content')).element(by.cssContainingText('.mat-icon', 'add'));
  }
  getNewProductInput(){
    return element(by.css('schedule-detailed-list')).element(by.css('.mat-input-infix')).element(by.css('input'));
  }
  getSaveProductToScheduleButton(){
    return element(by.css('.list-content')).all(by.css('.section')).last().element(by.cssContainingText('.mat-icon', 'add'));
  }
  getNewProductIsScheduled(){
    return element(by.css('.item--schedule')).element(by.cssContainingText('.mat-icon', 'add'));
  }
  generateNumber(length: number = 2): string {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
