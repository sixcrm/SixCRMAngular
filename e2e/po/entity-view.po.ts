import {by, element} from 'protractor';

export class EntityViewPage {

  getComponent() {
    return element(by.css('.entity-view'))
  }

  getEntityNameHeader() {
    return element(by.css('.entity-view__info__data__name')).element(by.css('span'));
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

  getAddNewModalInvalidInputs() {
    return element.all(by.css('.ng-invalid'));
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
    return this.getAssociationTable(num).element(by.css('.entity-view__table-component__header')).element(by.css('md-icon'));
  }

  getAssociationButton() {
    return element(by.css('.md-menu-content')).element(by.css('button'));
  }

  getAssociationInput() {
    return element(by.css('.default-autocomplete-input')).element(by.css('input'));
  }

  getFirstAssociationOption() {
    return element(by.css('.default-autocomplete-input__options__item'));
  }

  getAssociateButton() {
    return element.all(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }
}
