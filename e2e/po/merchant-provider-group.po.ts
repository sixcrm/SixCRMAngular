import {element, by} from 'protractor';

export class MerchantProviderGroupPage {

  getNewForm() {
    return element(by.css('merchant-provider-group-add-new'));
  }

  getNewFormInputs() {
    return element(by.css('merchant-provider-group-add-new')).all(by.css('input'));
  }

  getNewFormSaveButton() {
    return element(by.css('.entity-view__card__actions')).all(by.css('div')).last();
  }

  getErrorInputs() {
    return element(by.css('merchant-provider-group-add-new')).all(by.css('.ng-invalid'));
  }

  getMerchantProviderGroupName() {
    return element(by.css('.entity-view__info__data__name'));
  }

  getIndividualProvidergroup() {
    return element(by.css('tbody')).all(by.css('tr'));
  }

  getProviderGroupDeleteButton() {
    return element(by.css('tbody')).all(by.css('tr')).first().element(by.buttonText('delete'));
  }

  getProviderGroupDeleteModalButton() {
    return element(by.css('.delete-dialog-container')).all(by.css('button')).last();
  }

  getMerchantProviderIndexButton() {
    return element(by.css('.back'));
  }
}
