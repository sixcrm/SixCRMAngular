import {element, by} from 'protractor';

export class MerchantProviderPage {

  getNewForm() {
    return element(by.css('merchant-provider-add-new'));
  }

  getNewFormInput(num: number) {
    return element(by.css('merchant-provider-add-new')).all(by.css('mat-form-field')).get(num).element(by.css('input'));
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

  getMerchantIndividualCampaign() {
    return element(by.css('tbody')).all(by.css('tr'));
  }

  getMerchantDeleteButton() {
    return element(by.css('tbody')).all(by.css('tr')).last().element(by.css('button'));
  }

  getMerchantDeleteModalButton() {
    return element(by.css('.custom-dialog__buttons')).all(by.css('div')).last();
  }

  getMerchantIndexButton() {
    return element(by.css('.back'));
  }
}
