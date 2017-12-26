import {element, by} from 'protractor';

export class EmailTemplatePage {

  getNewForm() {
    return element(by.css('email-template-add-new'));
  }

  getNewFormInputs() {
    return element(by.css('email-template-add-new')).all(by.css('input'));
  }

  getNewFormSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getErrorInputs() {
    return element(by.css('email-template-add-new')).all(by.css('.ng-invalid'));
  }

  getDropdown(num: number) {
    return element(by.css('email-template-add-new')).all(by.css('.dropdown-component')).get(num);
  }

  getDropdownOption() {
    return element(by.css('email-template-add-new')).element(by.css('.dropdown-component__options__item'));
  }

}
