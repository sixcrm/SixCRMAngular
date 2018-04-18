import {element, by} from 'protractor';

export class MerchantProviderPage {

  getNewForm() {
    return element(by.css('merchant-provider-add-new'));
  }

  getNewFormInput(num: number) {
    return element(by.css('merchant-provider-add-new')).all(by.css('mat-input-container')).get(num).element(by.css('input'));
  }

  getNewFormCheckbox(num: number) {
    return element(by.css('merchant-provider-add-new')).all(by.css('mat-checkbox')).get(num);
  }

  getNewFormSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getErrorInputs() {
    return element(by.css('merchant-provider-add-new')).all(by.css('.ng-invalid'));
  }

  getDropdown(num: number) {
    return element(by.css('merchant-provider-add-new')).all(by.css('.dropdown-component')).get(num);
  }

  getDropdownOption() {
    return element(by.css('merchant-provider-add-new')).element(by.css('.dropdown-component__options__item'));
  }
}
