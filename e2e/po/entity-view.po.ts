import {by, element} from 'protractor';

export class EntityViewPage {

  getComponent() {
    return element(by.css('.entity-view'))
  }

  getEntityNameHeader() {
    return element(by.css('.entity-view__info__data__name')).element(by.css('span'));
  }

  getEntityNameHeaderSolo() {
    return element(by.css('.entity-view__info__data__name'));
  }

  getEntityNameFormHeader() {
    return element(by.css('.entity-view__info__data__name')).element(by.css('input'));
  }

  getUpdateButtonHeader() {
    return element(by.css('.entity-view__info__edit__update'));
  }

  getAddNewModal() {
    return element(by.css('.modal-center'));
  }

  getAddNewModalInputs() {
    return element(by.css('.modal-center')).all(by.css('input'));
  }

  getAddNewModalTextarea() {
    return element(by.css('.modal-center')).element(by.css('.mat-input-element-textarea'));
  }

  getAddNewModalDropdowns() {
    return element(by.css('.modal-center')).all(by.css('.dropdown-component'));
  }

  getAddNewModalDropdownOptions(dropdown: number, option: number) {
    return element(by.css('.modal-center')).all(by.css('.dropdown-component')).get(dropdown).all(by.css('.dropdown-component__options__item')).get(option);
  }

  getAddNewModalInvalidInputs() {
    return element.all(by.css('.ng-invalid'));
  }

  getAddNewModalErrorInputs() {
    return element.all(by.css('.error'));
  }

  getAddNewModalSave() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getAssociationTable(num: number) {
    return element.all(by.css('.entity-view__table-component')).get(num);
  }

  getAssociatedElements(num: number) {
    return this.getAssociationTable(num).element(by.css('tbody')).all(by.css('tr'));
  }

  getAssocitionMenuButton(num: number) {
    return this.getAssociationTable(num).element(by.css('.entity-view__table-component__header')).element(by.css('.entity-view__table-component__header__action'));
  }

  getAssociationButton() {
    return element(by.css('.mat-menu-content')).element(by.css('button'));
  }

  getAssociationInput() {
    return element(by.css('.default-autocomplete-input')).element(by.css('input'));
  }

  getAssociatedInputOption() {
    return element(by.css('.default-autocomplete-input__options__item'));
  }

  getFirstAssociationOption(num: number) {
    return element.all(by.css('.default-autocomplete-input__options__item')).get(num);
  }

  getAssociateButton() {
    return element.all(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }

  getTabLabels() {
    return element.all(by.css('.entity-view__navigation__label'));
  }

  getFirstCardMenuButton() {
    return element(by.css('.entity-view__card__header')).element(by.css('mat-icon'))
  }

  gitFirstCardInputs() {
    return element(by.css('.entity-view__card')).all(by.css('input'))
  }
}
